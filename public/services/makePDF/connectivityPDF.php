<?php

$json_data = $_REQUEST['allPDFData'];
$arr_allData = json_decode($json_data, true);



    
    // print_r($arr_allData[0]["1"]);


    //$table1_value = $arr_allData[0];
    // foreach($table1_value as $val){
    //     print_r($val);
    // }

// $table1_score = $arr_allData[1];
// echo "<pre>";
// print_r($arr_allData);
// echo "</pre>";
// print_r($table1_value);
// print_r($table1_score);
// return;

require('../../bower_components/fpdf182/fpdf.php');

class PDF extends FPDF
{
    // Page header
    function Header()
    {
        $pageWidth = 294;
        $pageHeight = 207;
        $margin = 3;
        $this->SetDrawColor(166 , 166, 166);
        $this->Rect( $margin, $margin , $pageWidth - $margin , $pageHeight - $margin);

        if ($this->page == 1)
        {
            // Logo 1
            $this->Image('../../images/urbanunit .png',10,8,50);
            // Line break
            $this->Ln(20);

            //Heading 1
            $this->SetFont('Arial','B',12,0);
            $this->SetFillColor(72, 169, 71);
            $this->SetTextColor(255, 255, 255);
            $this->SetXY(70,10);
            $this->Cell(180,8,'Assessment Report of Road Scheme',0,0,'C',true);

            //Heading 2
            $this->SetFont('Arial','B',10,0);
            $this->SetFillColor(78, 100, 140);
            $this->SetTextColor(255, 255, 255);
            $this->SetXY(70,18);
            $this->Cell(180,8,'Evaluation w.r.t. PSS Alignment',0,0,'C',true);
            //$this->Ln(20);

            // Logo 2
            $this->Image('../../images/logo.png',260,8,22,22);
            // Line break
            $this->Ln(20);

        }

    }

    // Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetXY(270,-15);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        // Page number
        $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
    }


}
// Instantiation of inherited class
$pdf = new PDF('L','mm','A4');
$pdf->AliasNbPages();
$pdf->AddPage();


//table headers and table values
$table_headings = array('Scheme Name', 'Scheme Cost (Milloion Rs)', 'Lenghth of the Road (Km)','Scheme Type','Tehsil(s)','District(s)');
$table_values = array('scheme1','50000','84','Construction of Bridge','Bhowana,18 Hazari,Lalian,Mankera,Jhang','Chiniot');



//table print
$pdf->SetFillColor(240 , 240, 240);//Gray
        $pdf->SetFont('','B',10,0);
$pdf->Cell(144,12,'Scheme Summary',1,1,'L',true);

        
        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,12,'Scheme Name',1,0,'L',true);
        $pdf->Cell(72,12,$arr_allData[8]["tblOneVal_1"],1,1,'L',true);
        $pdf->SetFillColor(240 , 240, 240);//Gray
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,12,'Scheme Cost (Milloion Rs)',1,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->Cell(72,12,$arr_allData[8]["tblOneVal_2"],1,1,'L',true);
        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,12,'Lenghth of the Road (Km)',1,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->Cell(72,12,$arr_allData[8]["tblOneVal_3"],1,1,'L',true);
        $pdf->SetFillColor(240 , 240, 240);//Gray
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,12,'Scheme Type',1,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->Cell(72,12,$arr_allData[8]["tblOneVal_4"],1,1,'L',true);
        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,12,'Tehsil(s)',1,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->Cell(72,12,$arr_allData[8]["tblOneVal_5"],1,1,'L',true);
        $pdf->SetFillColor(240 , 240, 240);//Gray
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,12,'District(s)',1,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->Cell(72,12,$arr_allData[8]["tblOneVal_6"],1,1,'L',true);


        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,36,'Coordinates',1,0,'C',true);
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(36,12,'Start Point',1,0,'',true);
        $pdf->Cell(36,12,'End Point',1,0,'',true);
        // invisible line 
        $pdf->Cell(0,12,'',1,1);
        $pdf->Cell(72,12,'',0,0);

        $pdf->SetFont('','',10,0);
        $pdf->Cell(36,12,$arr_allData[8]["tblOneVal_7"],1,0,'',true);
        $pdf->Cell(36,12,$arr_allData[8]["tblOneVal_8"],1,0,'',true);
        $pdf->Cell(0,12,'',1,1);
        $pdf->Cell(72,12,'',0,0);
        $pdf->SetFont('','',10,0); 
        $pdf->Cell(36,12,$arr_allData[8]["tblOneVal_9"],1,0,'',true);
        $pdf->Cell(36,12,$arr_allData[8]["tblOneVal_10"],1,1,'',true);   

        $pdf->SetFillColor(240 , 240, 240);//Gray
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(72,24,'Assessment Result',1,0,'C',true);
        $pdf->SetFont('','',10,0);
        $pdf->Cell(72,12,'Aligned With PSS',1,0,'C',true);
        $pdf->Cell(0,12,'',1,1);
        $pdf->Cell(72,12,'',0,0);
        $pdf->Cell(72,12,$arr_allData[8]["tblOneVal_11"],1,0,'C',true);
        

//map
$pdf->SetXY(155,38);
//$pdf->Cell(132,143,'Map','1',0,'C');
$pin_point1 = 'conn_map_1.png';
$dataURI    = $arr_allData[18]["conn_map_1"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($pin_point1,$decodedImg);
$pdf->Ln();
$pdf->Image($pin_point1,155,38,132,140);
unlink($pin_point1);



$pdf->AddPage();

// $pdf->SetFont('Arial','B',11,0);
// $pdf->SetFillColor(154, 238, 234);
// $pdf->SetTextColor(51, 51, 51);
// $pdf->Cell(275,10,'Parameters for Assessment of Proposed Road Project',0,0,'C',true);
// $pdf->SetTextColor(0, 0, 0);


$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'Parameters for Assessment of Proposed Road Project',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);


$gauge_2_para = "A Common indicator used to measure accessibility of the two points.It is ration between Network Distance to Euclidean Distance.";
$gauge_3_para = "It includes connectivity to Moterways, CPEC corridor,National and Strategic Highways.";
$gauge_4_para = "Travel speed is based on the type ,width quality and class of road network available between origin and destination under free flow condition.";
$gauge_5_para = "Based on Tehsil-wise outcome of Public Transport Infrastructure Accessibility Index,which is developed using impartial methodology for determining transport deprivation.";
$gauge_6_para = "Developing East West connections in Punjab is envisioned in PSS and also a priority by C&W department since national network runs North-South.";
$gauge_7_para = "Connecting cities and hubs is crucial to develop system of cities planned under PSS.Classificaation of the cities is based on proposed system of cities under PSS.";


$Gauge_1 = 'Gauge_1.png';
$dataURI    = $arr_allData[11]["Gauge_1"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_1,$decodedImg);
$pdf->Image($Gauge_1,115,20,65,27);
unlink($Gauge_1);
$pdf->SetXY(127,48);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetFont('Arial','',10,0);
$pdf->Cell(40,5,$arr_allData[11]["Gauge_1_name"],0,0,'C');
$pdf->SetXY(127,56);
$pdf->Cell(40,5,$arr_allData[11]["Gauge_1_value"],0,0,'C');



$Gauge_2 = 'Gauge_2.png';
$dataURI    = $arr_allData[12]["Gauge_2"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_2,$decodedImg);
$pdf->Image($Gauge_2,15,62,65,27);
unlink($Gauge_2);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(37,68);
$pdf->Cell(20,50,$arr_allData[12]["Gauge_2_name"],0,0,'C');
$pdf->SetXY(38,78);
$pdf->Cell(20,40,$arr_allData[12]["Gauge_2_value"],0,0,'C');
$pdf->SetXY(20,102);
$pdf->MultiCell(56,4,$gauge_2_para,0,'C',false);

$Gauge_3 = 'Gauge_3.png';
$dataURI    = $arr_allData[13]["Gauge_3"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_3,$decodedImg);
$pdf->Image($Gauge_3,112,62,65,27);
unlink($Gauge_3);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(127,68);
$pdf->Cell(35,50,$arr_allData[13]["Gauge_3_name"],0,0,'C');
$pdf->SetXY(115,78);
$pdf->Cell(60,40,$arr_allData[13]["Gauge_3_value"],0,0,'C');
$pdf->SetXY(117,102);
$pdf->MultiCell(56,4,$gauge_3_para,0,'C',false);


$Gauge_4 = 'Gauge_4.png';
$dataURI    = $arr_allData[14]["Gauge_4"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_4,$decodedImg);
$pdf->Image($Gauge_4,210,62,65,27);
unlink($Gauge_4);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(225,68);
$pdf->Cell(35,50,$arr_allData[14]["Gauge_4_name"],0,0,'C');
$pdf->SetXY(213,78);
$pdf->Cell(60,40,$arr_allData[14]["Gauge_4_value"],0,0,'C');
$pdf->SetXY(215,102);
$pdf->MultiCell(56,4,$gauge_3_para,0,'C',false);

$Gauge_5 = 'Gauge_5.png';
$dataURI    = $arr_allData[15]["Gauge_5"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_5,$decodedImg);
$pdf->Image($Gauge_5,15,125,65,27);
unlink($Gauge_5);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(37,128);
$pdf->Cell(20,50,$arr_allData[15]["Gauge_5_name"],0,0,'C');
$pdf->SetXY(38,139);
$pdf->Cell(20,40,$arr_allData[15]["Gauge_5_value"],0,0,'C');
$pdf->SetXY(20,163);
$pdf->MultiCell(56,4,$gauge_5_para,0,'C',false);

$Gauge_6 = 'Gauge_6.png';
$dataURI    = $arr_allData[16]["Gauge_6"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_6,$decodedImg);
$pdf->Image($Gauge_6,112,125,65,27);
unlink($Gauge_6);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(127,128);
$pdf->Cell(35,50,$arr_allData[16]["Gauge_6_name"],0,0,'C');
$pdf->SetXY(115,139);
$pdf->Cell(60,40,$arr_allData[16]["Gauge_6_value"],0,0,'C');
$pdf->SetXY(117,163);
$pdf->MultiCell(56,4,$gauge_6_para,0,'C',false);

$Gauge_7 = 'Gauge_7.png';
$dataURI    = $arr_allData[17]["Gauge_7"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_7,$decodedImg);
$pdf->Image($Gauge_7,210,125,65,27);
unlink($Gauge_7);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(225,128);
$pdf->Cell(35,50,$arr_allData[17]["Gauge_7_name"],0,0,'C');
$pdf->SetXY(213,139);
$pdf->Cell(60,40,$arr_allData[17]["Gauge_7_value"],0,0,'C');
$pdf->SetXY(215,163);
$pdf->MultiCell(56,4,$gauge_7_para,0,'C',false);



$pdf->Ln();
$pdf->AddPage();

// category table 
$pdf->SetFillColor(240 , 240, 240);//Gray
$pdf->SetFont('','B',10,0);
$pdf->Cell(40,7,'Category',1,0,'C',true);
$pdf->Cell(210,7,'Description',1,0,'',true);
$pdf->Cell(20,7,'Result',1,1,'',true);
$pdf->SetFillColor(255 , 255, 255);//white
$pdf->SetFont('','',10,0);
$pdf->Cell(40,7,'Category A',1,0,'C',true);
$pdf->Cell(210,7,'If >75% of Proposed Alignment matches with PSS alignments then PC-I is considered to follow PSS not need to be evaluated.',1,0,'',true);
$pdf->Cell(20,7,$arr_allData[9]["tblcatVal_1"],1,1,'',true);
$pdf->SetFillColor(240 , 240, 240);//Gray
$pdf->Cell(40,7,'Category B',1,0,'C',true);
$pdf->Cell(210,7,'If >75% of Proposed Alignment matches with PSS alignments then PC-I is considered to follow PSS not need to be evaluated.',1,0,'',true);
$pdf->Cell(20,7,$arr_allData[9]["tblcatVal_2"],1,1,'',true);
$pdf->SetFillColor(255 , 255, 255);//white
$pdf->Cell(40,7,'Category C',1,0,'C',true);
$pdf->Cell(210,7,'If >75% of Proposed Alignment matches with PSS alignments then PC-I is considered to follow PSS not need to be evaluated.',1,0,'',true);
$pdf->Cell(20,7,$arr_allData[9]["tblcatVal_3"],1,1,'',true);

$pdf->Ln();

// Summary table 
$pdf->SetFont('Arial','B',22,0);
$pdf->SetFillColor(255 , 255, 255);//white
$pdf->SetTextColor(0, 0, 0);
$pdf->Cell(275,10,'Summary',0,1,'C',true);
$pdf->Ln();
$pdf->SetFillColor(240 , 240, 240);//Gray
$pdf->SetFont('','B',10,0);
$pdf->Cell(90,7,'Buffer In Km',1,0,'C',true);
$pdf->Cell(90,7,'Score',1,0,'C',true);
$pdf->Cell(90,7,'Impact',1,1,'C',true);
$pdf->SetFillColor(255 , 255, 255);//white
$pdf->SetFont('','',10,0);
$pdf->Cell(90,7,'5km',1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_1impact"],1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_1score"],1,1,'C',true);

$pdf->SetFillColor(240 , 240, 240);//Gray
$pdf->Cell(90,7,'10km',1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_2impact"],1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_2score"],1,1,'C',true);

$pdf->SetFillColor(255 , 255, 255);//white
$pdf->Cell(90,7,'15km',1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_3impact"],1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_3score"],1,1,'C',true);
$pdf->SetFillColor(240 , 240, 240);//Gray
$pdf->Cell(90,7,'20km',1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_4impact"],1,0,'C',true);
$pdf->Cell(90,7,$arr_allData[10]["tblsumVal_4score"],1,1,'C',true);

$pdf->Ln();

// Stage 2 tables 
$pdf->SetFont('Arial','B',22,0);
$pdf->SetFillColor(255 , 255, 255);//white
$pdf->SetTextColor(0, 0, 0);
$pdf->Cell(275,10,'Stage 2',0,1,'C',true);
$pdf->Ln();

$pdf->SetFillColor(72, 169, 71);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('','B',9,0);
$pdf->Cell(70,7,'Factor Scoring for Stage 2 With 5 KM Buffer',1,0,'C',true);
$pdf->Cell(70,7,'Factor Scoring for Stage 2 With 10 KM Buffer',1,0,'C',true);
$pdf->Cell(70,7,'Factor Scoring for Stage 2 With 15 KM Buffer',1,0,'C',true);
$pdf->Cell(70,7,'Factor Scoring for Stage 2 With 20 KM Buffer',1,1,'C',true);

for($i=0; $i<4; $i++){
    
    $pdf->SetFillColor(78, 100, 140);
    $pdf->SetTextColor(255, 255, 255);
    $pdf->SetFont('','B',10,0);
    $pdf->Cell(8,8,'Sr',1,0,'C',true);
    $pdf->Cell(30,8,'Parameter',1,0,'C',true);
    $pdf->Cell(18,8,'Value',1,0,'C',true);
    $pdf->Cell(14,8,'Score',1,0,'C',true);
}
$pdf->Ln();




//table headers and table values
$table_sr = array('1', '2', '3','4','5','5.1','5.2', '5.3', '5.4','6','7','8','8.1', '8.2', '8.3','9','9.1','9.2','9.3', '9.4', '10','10.1','10.2','10.3', '10.4', '11', '12');
$table_parameter = array('Population','Railway','Dryport','Economic Zone','Health','DHQ','THQ','BHU','RHU','Protected Area','TotalAirPorts','Industry','Large Industries','Medium Industries','Small Industries','Education','Primary','Secondary','Colleges','Universities','Roads','Express Moterways','Highways', 'Primary Roads', 'Secondary Roads','Total Score','Impact Factor');
$table1_value = $arr_allData[0];
$table1_score = $arr_allData[1];
$table2_value = $arr_allData[2];
$table2_score = $arr_allData[3];
$table3_value = $arr_allData[4];
$table3_score = $arr_allData[5];
$table4_value = $arr_allData[6];
$table4_score = $arr_allData[7];
//table print




// $table_sr =array('1', '2', '3','4','5','6','7');
// $table_parameter = array('Population','Railway','Dryport','Economic Zone','Health','DHQ','THQ');
// $table1_value = array('val1', '2', '3','4','5','5.1','5.2');
// $table1_score = array('1', '2', '3','4','5','5.1','5.2');
// $table2_value = array('val1', '2', '3','4','5','5.1','5.2');
// $table2_score = array('1', '2', '3','4','5','5.1','5.2');
// $table3_value = array('val1', '2', '3','4','5','5.1','5.2');
// $table3_score = array('1', '2', '3','4','5','5.1','5.2');
// $table4_value = array('val1', '2', '3','4','5','5.1','5.2');
// $table4_score = array('1', '2', '3','4','5','5.1','5.2');


$pdf->SetFillColor(255, 255, 255);
$pdf->SetTextColor(0, 0, 0);
$pdf->SetFont('','',10,0); 

$counter = 0;

for($i=0; $i<27; $i++){
    $counter ++;
    if($counter % 2 == 1)
    {
            $pdf->SetFillColor(240 , 240, 240);//gray
            $pdf->SetTextColor(0, 0, 0);
            $pdf->SetFont('','',10,0);    

        $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
        $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
        $pdf->Cell(18,8,$table1_value["$i"],1,0,'C',true);
        $pdf->Cell(14,8,$table1_score["$i"],1,0,'C',true);
        $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
        $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
        $pdf->Cell(18,8,$table2_value["$i"],1,0,'C',true);
        $pdf->Cell(14,8,$table2_score["$i"],1,0,'C',true);
        $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
        $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
        $pdf->Cell(18,8,$table3_value["$i"],1,0,'C',true);
        $pdf->Cell(14,8,$table3_score["$i"],1,0,'C',true);
        $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
        $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
        $pdf->Cell(18,8,$table4_value["$i"],1,0,'C',true);
        $pdf->Cell(14,8,$table4_score["$i"],1,1,'C',true);
    }
    else
    {
        $pdf->SetFillColor(255, 255, 255);//white
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetFont('','',10,0);     
    $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
    $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
    $pdf->Cell(18,8,$table1_value["$i"],1,0,'C',true);
    $pdf->Cell(14,8,$table1_score["$i"],1,0,'C',true);
    $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
    $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
    $pdf->Cell(18,8,$table2_value["$i"],1,0,'C',true);
    $pdf->Cell(14,8,$table2_score["$i"],1,0,'C',true);
    $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
    $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
    $pdf->Cell(18,8,$table3_value["$i"],1,0,'C',true);
    $pdf->Cell(14,8,$table3_score["$i"],1,0,'C',true);
    $pdf->Cell(8,8,$table_sr[$i],1,0,'C',true);
    $pdf->cell(30,8,$table_parameter[$i],1,0,'L',true);
    $pdf->Cell(18,8,$table4_value["$i"],1,0,'C',true);
    $pdf->Cell(14,8,$table4_score["$i"],1,1,'C',true);
    }

}

// $x=80;
// $y=135;
// for($i=0; $i<6; $i++){
//     $pdf->SetXY($x,$y);
//     $y+=8;
//     $pdf->Cell(8,8,$table1_sr[$i],1,0,'C',true);
//     $pdf->cell(25,8,$table1_parameter[$i],1,0,'L',true);
//     $pdf->Cell(19,8,$table1_value[$i],1,0,'C',true);
//     $pdf->Cell(18,8,$table1_score[$i],1,1,'C',true);
// }

// $x=150;
// $y=135;
// for($i=0; $i<6; $i++){
//     $pdf->SetXY($x,$y);
//     $y+=8;
//     $pdf->Cell(8,8,$table1_sr[$i],1,0,'C',true);
//     $pdf->cell(25,8,$table1_parameter[$i],1,0,'L',true);
//     $pdf->Cell(19,8,$table1_value[$i],1,0,'C',true);
//     $pdf->Cell(18,8,$table1_score[$i],1,1,'C',true);
// }

// $x=220;
// $y=135;
// for($i=0; $i<6; $i++){
//     $pdf->SetXY($x,$y);
//     $y+=8;
//     $pdf->Cell(8,8,$table1_sr[$i],1,0,'C',true);
//     $pdf->cell(25,8,$table1_parameter[$i],1,0,'L',true);
//     $pdf->Cell(19,8,$table1_value[$i],1,0,'C',true);
//     $pdf->Cell(18,8,$table1_score[$i],1,1,'C',true);
// }

 
// foreach(array_combine($table1_sr, $table1_parameter) as $sr => $para)
// {
//     $pdf->SetFillColor(255, 255, 255);
//     $pdf->SetTextColor(0, 0, 0);
//     $pdf->SetFont('','',10,0);
//     $pdf->Cell(8,8,$sr,1,0,'C',true);
//     $pdf->cell(25,8,$para,1,0,'L',true);
    
// }


// foreach(array_combine($table1_value, $table1_score) as $val => $score)
// {
//     $pdf->Cell(19,8,$val,1,0,'C',true);
//     $pdf->Cell(18,8,$score,1,1,'C',true);
// }
    
//$pdf->SetFont('Arial','B',10,0);
//$pdf->SetFillColor(78, 100, 140);
//$pdf->SetTextColor(255, 255, 255);
//$pdf->Cell(277,10,'PROPOSED SITE READINESS GAUGES',0,0,'C',true);

//for($i=1;$i<=40;$i++)
//{
//    $pdf->Cell(0,10,'Printing line number '.$i,0,1);
//}








// $pdf->output();

$pdf->SetAuthor('PSS');
$pdf_file_name = 'PSS'.'Connectivity'.'.pdf';
$pdf->SetTitle($pdf_file_name);
$pdf->Output('D',$pdf_file_name);

