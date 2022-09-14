SELECT 
   flights."carrier" as "carrier",
   flights."flight_num" as "flight_num",
   flights."flight_time" as "flight_time",
   flights."tail_num" as "tail_num",
   flights."dep_time" as "dep_time",
   flights."arr_time" as "arr_time",
   flights."dep_delay" as "dep_delay",
   flights."arr_delay" as "arr_delay",
   flights."taxi_out" as "taxi_out",
   flights."taxi_in" as "taxi_in",
   flights."distance" as "distance",
   flights."cancelled" as "cancelled",
   flights."diverted" as "diverted",
   flights."id2" as "id2",
   flights."origin" as "origin_code",
   flights."destination" as "destination_code"
FROM 'data/flights.parquet' as flights
