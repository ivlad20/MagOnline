package com.example.spring_boot_jdbc_app.repository;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.spring_boot_jdbc_app.model.AdminDtos.QueryResult;
import com.example.spring_boot_jdbc_app.model.AdminDtos.TableInfo;
import com.example.spring_boot_jdbc_app.model.ApiException;

/**
 * Database browser and read-only SQL console for admins.
 *
 * Safety: queries run inside a read-only transaction (MySQL rejects any write in it), only
 * SELECT/SHOW/DESCRIBE/EXPLAIN/WITH statements are accepted, one statement at a time, with a
 * row cap and a timeout. Password hashes are masked. Changes go through the typed admin endpoints.
 */
@Repository
public class DatabaseConsoleRepository {

    private static final int MAX_ROWS = 500;
    private static final int TIMEOUT_SECONDS = 10;
    private static final Pattern ALLOWED_START = Pattern.compile("^(select|show|describe|desc|explain|with)\\b");
    private static final Pattern FORBIDDEN = Pattern.compile(
            "\\b(into\\s+(outfile|dumpfile)|load_file|sleep|benchmark|get_lock|for\\s+update|lock\\s+in\\s+share\\s+mode)\\b");

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    public List<TableInfo> listTables() {
        List<String> names = tableNames();
        List<TableInfo> tables = new ArrayList<>();
        for (String name : names) {
            Long rows = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM `" + name + "`", Long.class);
            tables.add(new TableInfo(name, rows == null ? 0 : rows));
        }
        return tables;
    }

    private List<String> tableNames() {
        return jdbcTemplate.queryForList("""
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'
                ORDER BY table_name""", String.class);
    }

    /** One page of a table, newest rows first (by the first column, usually the id). */
    @Transactional(readOnly = true)
    public QueryResult browseTable(String table, int page, int size) {
        if (!tableNames().contains(table)) throw new ApiException(HttpStatus.NOT_FOUND, "Tabelul nu există.");
        int pageSize = Math.max(1, Math.min(size, 200));
        int offset = Math.max(0, page) * pageSize;
        long start = System.currentTimeMillis();
        Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM `" + table + "`", Long.class);
        String sql = "SELECT * FROM `" + table + "` ORDER BY 1 DESC LIMIT " + pageSize + " OFFSET " + offset;
        QueryResult r = jdbcTemplate.query(sql, (ResultSetExtractor<QueryResult>) rs -> toResult(rs, Integer.MAX_VALUE, start));
        return new QueryResult(r.columns(), r.rows(), total == null ? 0 : total, false, r.tookMs());
    }

    /** Runs one read-only statement typed in the SQL console. */
    @Transactional(readOnly = true, timeout = TIMEOUT_SECONDS)
    public QueryResult runReadOnly(String rawSql) {
        String sql = rawSql == null ? "" : rawSql.trim();
        while (sql.endsWith(";")) sql = sql.substring(0, sql.length() - 1).trim();
        String lower = sql.toLowerCase(Locale.ROOT);

        if (sql.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "Scrie o interogare.");
        if (sql.length() > 10_000) throw new ApiException(HttpStatus.BAD_REQUEST, "Interogarea e prea lungă.");
        if (sql.contains(";")) throw new ApiException(HttpStatus.BAD_REQUEST, "Rulează o singură interogare odată.");
        if (!ALLOWED_START.matcher(lower).find()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Consola e doar pentru citire (SELECT, SHOW, DESCRIBE, EXPLAIN). Modificările se fac din secțiunile Comenzi, Produse și Oferte.");
        }
        if (FORBIDDEN.matcher(lower).find()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Interogarea folosește o funcție care nu e permisă în consolă.");
        }

        JdbcTemplate limited = new JdbcTemplate(dataSource); // same connection: joins the read-only transaction
        limited.setMaxRows(MAX_ROWS + 1);
        limited.setQueryTimeout(TIMEOUT_SECONDS);
        long start = System.currentTimeMillis();
        return limited.query(sql, (ResultSetExtractor<QueryResult>) rs -> toResult(rs, MAX_ROWS, start));
    }

    private static QueryResult toResult(ResultSet rs, int maxRows, long start) throws SQLException {
        ResultSetMetaData md = rs.getMetaData();
        int n = md.getColumnCount();
        List<String> columns = new ArrayList<>();
        for (int i = 1; i <= n; i++) columns.add(md.getColumnLabel(i));

        List<List<Object>> rows = new ArrayList<>();
        boolean truncated = false;
        while (rs.next()) {
            if (rows.size() >= maxRows) {
                truncated = true;
                break;
            }
            List<Object> row = new ArrayList<>(n);
            for (int i = 1; i <= n; i++) {
                row.add(cell(columns.get(i - 1), rs.getObject(i)));
            }
            rows.add(row);
        }
        return new QueryResult(columns, rows, rows.size(), truncated, System.currentTimeMillis() - start);
    }

    /** JSON-friendly cell value; password hashes are never sent to the browser. */
    private static Object cell(String column, Object v) {
        if (v == null) return null;
        if (column.toLowerCase(Locale.ROOT).contains("password")) return "••••••";
        if (v instanceof Number || v instanceof Boolean || v instanceof String) return v;
        if (v instanceof byte[] b) return "<binar, " + b.length + " octeți>";
        if (v instanceof java.time.LocalDateTime dt) return dt.toString().replace('T', ' ');
        return v.toString(); // dates, times, etc.
    }
}
