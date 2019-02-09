# Indoor track GPS generator

Since I store all my running history on Strava, I wanted an easy way to upload indoor track workouts to Strava to be processed.

This takes a csv file of the lap time and heart rate and generates a tcx file. I generate the CSV file from doing an indoor workout activity on my Suunto Ambit3 and triggering a lap each time around.

## Instructions for use

1. `npm install`
2. Sample command: `npm run script -- --input sample-input/sample.csv  --output output/test.tcx --config track-config/olympic-oval.json --time 2019-02-08T19:48:00.000`. Refer to help command for more information.

## Generating new track config files

A track config file consists of 5 parameters:
- centerLatitude: Latitude of the center of the track. In decimal degrees. Retrieve from Google Maps/Earth.
- centerLongitude: Longitude of the center of the track. In decimal degrees. Retrieve from Google Maps/Earth.
- offset: This is how much the track is rotated from north/south. Measured in degrees from due east CCW. 
           Can convert from bearing from the center to track start via azimuth to CCW angle conversion: https://math.stackexchange.com/a/926248
           Or can just trial and error it on http://www.gpsvisualizer.com/
- trackLength: The average track length of the lanes that you went in. Measured in meters.
- ratioSideToRadius: Essentially how oval it is, 2.5 is a reasonable default. 0 if it is a circle.
