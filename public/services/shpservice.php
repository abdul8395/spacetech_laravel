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
    
            $shpurl=$_REQUEST['url'];
            $user=$_REQUEST['user_id'];
            $data_id=$_REQUEST['data_id'];
			


        try {
            // Open Shapefile
            $Shapefile = new ShapefileReader($shpurl);
            $qst="INSERT INTO public.tbl_shp(geom, attributes,user_id,data_id) VALUES ";
            // $j=1;
            // Read all the records
            while ($Geometry = $Shapefile->fetchRecord()) {
                // Skip the record if marked as "deleted"
                if ($Geometry->isDeleted()) {
                    continue;
                }
                
                // Print Geometry as an Array
                //print_r($Geometry->getArray());
                
                // Print Geometry as WKT
                // print_r($Geometry->getWKT());
                $geom = $Geometry->getWKT();
				
				//print_r($geom);
                
                // Print Geometry as GeoJSON
                // print_r($Geometry->getGeoJSON());
                
                // Print DBF data
                // echo "<pre>";
                // print_r($Geometry->getDataArray());
                $dbfjson=json_encode($Geometry->getDataArray());
                //$dbfjson=$Geometry->getDataArray();
                  //print_r() 
                $qst=$qst."(st_geomFromText('$geom',4326), '$dbfjson','$user',$data_id),";
                // echo "</pre>";
                // $j=$j+1;
                // if($j==3){
                //     break;
                // }
                
            }
            $q= substr(trim($qst), 0, -1);
          //  echo $q;
           // exit();   			
            $rs=pg_query($q);
            if($rs){
                echo "success";
                // deleteDir($targetdir);
            }else{
                echo "failed";
            }

        
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