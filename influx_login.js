// import {InfluxDB, Point} from 'https://unpkg.com/@influxdata/influxdb-client-browser/dist/index.browser.mjs';
      
// let url="https://eu-central-1-1.aws.cloud2.influxdata.com/";
// let token="WyskRtLpDBl9p78HZSz1usnpFi68j0t9LiB7YmxNixlzJKxE8JzAJ20C1WK8V2qpUX2MZourn-ulW-4v1chZGw==";
// let org="Rpi-Project";

// const influx2 = new InfluxDB({url,token });
// let query2 = 'from(bucket: "ReportedData")\
//                 |> range(start: -30d)\
//                 |> filter(fn: (r) => r["_measurement"] == "loginIds")\
//                 |> filter(fn: (r) => r["DB"] == "db3")\
//                 |> filter(fn: (r) => r["_field"] == "Credintials")\
//                 |> unique()\
//                 |> yield(name: "unique")'
// var Noicedata = [];
// let text="";

// function fetchAllUsers(fluxQuery) {

//     const queryApi = new InfluxDB({url, token}).getQueryApi(org)
//     queryApi.queryRows(fluxQuery, {
//         next(row, tableMeta) {
//             const o = tableMeta.toObject(row);
//             Noicedata.push(o._value);
//         },
//         complete() {
//             console.log('FINISHED')
//             // console.log(Noicedata)

//             Noicedata.forEach(printingVolume);

//             console.log(text);
//             return text;

//         },
//         error(error) {
//             console.log('QUERY FAILED', error)
//         },
//     });
// }

// function printingVolume(item) {
// text += item
// }

// // function sleep(ms) {
// //     return new Promise(resolve => setTimeout(resolve, ms));
// // }

// function fetchUser() {
//     fetchAllUsers(query2);
// }