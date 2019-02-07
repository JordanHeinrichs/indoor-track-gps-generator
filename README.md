# Indoor track GPS generator

Since I store all my running history on Strava, I wanted an easy way to upload indoor track workouts to Strava and have them accurately be processed by their graphs.

This takes a csv file of the lap time and heart rate and generates a tcx file.

# Instructions for use

1. `npm install`
2. Sample command: `npm run script -- --input sample-input/sample.csv  --output output/test.tcx --config track-config/jack-simpson.json --time 2018-02-14T03:19:28.000Z`. Refer to help command for more information.

More instructions to follow for generating your own track configs.
