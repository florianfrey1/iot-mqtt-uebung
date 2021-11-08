SELECT sub.*,
    TIMEDIFF(ts_meas, ts_in) AS ts_diff
FROM (
        SELECT ts_in,
            STR_TO_DATE(payload->>"$.ts_meas", '%Y-%m-%d %H:%i:%s') AS ts_meas,
            payload->>"$.id" AS id,
            payload->>"$.temp" AS temp,
            payload->>"$.battery" AS battery,
            payload->>"$.load" AS `load`,
            payload->>"$.memtotal" AS memtotal,
            payload->>"$.memavailable" AS memavailable
        FROM measurements
    ) AS sub;