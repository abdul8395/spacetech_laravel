<?php
 
    
    include("connection1.php");
        // Reading shape file
        // Register autoloader
        require_once('./lib/php-shapefile/src/Shapefile/ShapefileAutoloader.php');
        Shapefile\ShapefileAutoloader::register();

        // Import classes
        use Shapefile\Shapefile;
        use Shapefile\ShapefileException;
        use Shapefile\ShapefileReader;
    
    
    class LoadSHP extends connection
    {
        function __construct()
        {
            $this->connectionDB();
    
        }
    
        public function loadData()
        {
    
            $output = array();
    
            $shpurl=$_REQUEST['shpurl'];
			
		//	echo $shpurl;
			

    
        try {
            // Open Shapefile
            $Shapefile = new ShapefileReader($shpurl);
                $geojson='{"type": "FeatureCollection","features": [';

            while ($Geometry = $Shapefile->fetchRecord()) {

                $geojson=$geojson.'{
                    "type": "Feature",
                    "properties":'.json_encode($Geometry->getDataArray()).',
                    "geometry": {
                    "type": "Polygon",
                    "coordinates":'.json_encode(json_decode($Geometry->getGeoJSON())->coordinates).'}},';
            }

            $q= substr(trim($geojson), 0, -1);
            $q=$q.']}';
            echo $q;
        
        } catch (ShapefileException $e) {
            // Print detailed error information
            echo "Error Type: " . $e->getErrorType()
                . "\nMessage: " . $e->getMessage()
                . "\nDetails: " . $e->getDetails();
        }
    
            $this->closeConnection();
            // echo $output;
            
        }
    }
	
	$loadshp=new LoadSHP();
	
	$loadshp->loadData();
    
  
    

    ?>