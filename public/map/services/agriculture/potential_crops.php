<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class potential_crops extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $district_name = $_REQUEST['district_name'];


        $sql1="SELECT  bajra,banana,barley,bitter_gourd,
			chillies,citrus,cotton,cucumber,
			dates,phalsa,fodder,garlic,
			grams,guar_seed,guava,jaman,
			jowar,lady_finger,litchi,louqat,
			maize,mango,masoor,moong,
			onion,pomegranate,potato,rapeseed_and_mustard,
			rice,squash,tomato,water_and_musk_melon,
			wheat,sunflower
	FROM agri_punjab.tbl_potential_crops_ppt
	where district_n='".$district_name."';";


        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output = pg_fetch_all($result_query1);
        }



        $this->closeConnection();
        return json_encode($output);
    }


}

$json = new potential_crops();
//$json->closeConnection();
echo $json->loadData();


?>
