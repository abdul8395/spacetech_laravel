<?php

//$json_data = $_REQUEST['allData'];
//$arr_allData = json_decode($json_data, true);
//print_r($arr_allData);
//print_r($arr_allData[1]['tblEnv_1']);
//print_r($arr_allData[0]);
//return;

$json_data = $_REQUEST['allPDFData'];
$arr_allData = json_decode($json_data, true);

require('../../bower_components/fpdf182/fpdf.php');

//=================================================
//function hex2dec
//returns an associative array (keys: R,G,B) from a hex html code (e.g. #3FE5AA)
function hex2dec($couleur = "#000000"){
    $R = substr($couleur, 1, 2);
    $rouge = hexdec($R);
    $V = substr($couleur, 3, 2);
    $vert = hexdec($V);
    $B = substr($couleur, 5, 2);
    $bleu = hexdec($B);
    $tbl_couleur = array();
    $tbl_couleur['R']=$rouge;
    $tbl_couleur['G']=$vert;
    $tbl_couleur['B']=$bleu;
    return $tbl_couleur;
}

//conversion pixel -> millimeter in 72 dpi
function px2mm($px){
    return $px*25.4/72;
}

function txtentities($html){
    $trans = get_html_translation_table(HTML_ENTITIES);
    $trans = array_flip($trans);
    return strtr($html, $trans);
}

//=================================================

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
            $this->Cell(180,8,'SITE SUITABILITY ASSESSMENT FOR INDUSTRIAL ESTATES/SEZS',0,0,'C',true);

            //Heading 2
            $this->SetFont('Arial','B',11,0);
            $this->SetFillColor(78, 100, 140);
            $this->SetTextColor(255, 255, 255);
            $this->SetXY(70,18);
            $this->Cell(180,8,'PROPOSED SITE CHARACTERISTICS',0,0,'C',true);
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
        // Arial italic 8
        $this->SetFont('Arial','I',8);

        // Position at 1.5 cm from bottom
        $this->SetXY(2,-15);
        // Page number
        $this->Cell(50,10,'Punjab Spatial Strategy',0,0,'C');

        // Position at 1.5 cm from bottom
        $this->SetXY(270,-15);

        // Page number
        $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');


    }

    //=====================================================
    //variables of html parser
    protected $B;
    protected $I;
    protected $U;
    protected $HREF;
    protected $fontList;
    protected $issetfont;
    protected $issetcolor;

    function __construct($orientation='P', $unit='mm', $format='A4')
    {
        //Call parent constructor
        parent::__construct($orientation,$unit,$format);

        //Initialization
        $this->B=0;
        $this->I=0;
        $this->U=0;
        $this->HREF='';

        $this->tableborder=0;
        $this->tdbegin=false;
        $this->tdwidth=0;
        $this->tdheight=0;
        $this->tdalign="L";
        $this->tdbgcolor=false;

        $this->oldx=0;
        $this->oldy=0;

        $this->fontlist=array("arial","times","courier","helvetica","symbol");
        $this->issetfont=false;
        $this->issetcolor=false;
    }


    //html parser
    function WriteHTML($html)
    {
        $html=strip_tags($html,"<b><u><i><a><img><p><br><strong><em><font><tr><blockquote><hr><td><tr><table><sup>"); //remove all unsupported tags
        $html=str_replace("\n",'',$html); //replace carriage returns with spaces
        $html=str_replace("\t",'',$html); //replace carriage returns with spaces
        $a=preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE); //explode the string
        foreach($a as $i=>$e)
        {
            if($i%2==0)
            {
                //Text
                if($this->HREF)
                    $this->PutLink($this->HREF,$e);
                elseif($this->tdbegin) {
                    if(trim($e)!='' && $e!=";") {
                        $this->Cell($this->tdwidth,$this->tdheight,$e,$this->tableborder,'',$this->tdalign,$this->tdbgcolor);
                    }
                    elseif($e==";") {
                        $this->Cell($this->tdwidth,$this->tdheight,'',$this->tableborder,'',$this->tdalign,$this->tdbgcolor);
                    }
                }
                else
                    $this->Write(5,stripslashes(txtentities($e)));
            }
            else
            {
                //Tag
                if($e[0]=='/')
                    $this->CloseTag(strtoupper(substr($e,1)));
                else
                {
                    //Extract attributes
                    $a2=explode(' ',$e);
                    $tag=strtoupper(array_shift($a2));
                    $attr=array();
                    foreach($a2 as $v)
                    {
                        if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                            $attr[strtoupper($a3[1])]=$a3[2];
                    }
                    $this->OpenTag($tag,$attr);
                }
            }
        }
    }

    function OpenTag($tag, $attr)
    {
        //Opening tag
        switch($tag){

            case 'SUP':
                if( !empty($attr['SUP']) ) {
                    //Set current font to 6pt
                    $this->SetFont('','',6);
                    //Start 125cm plus width of cell to the right of left margin
                    //Superscript "1"
                    $this->Cell(2,2,$attr['SUP'],0,0,'L');
                }
                break;

            case 'TABLE': // TABLE-BEGIN
                if( !empty($attr['BORDER']) ) $this->tableborder=$attr['BORDER'];
                else $this->tableborder=0;
                break;
            case 'TR': //TR-BEGIN
                break;
            case 'TD': // TD-BEGIN
                if( !empty($attr['WIDTH']) ) $this->tdwidth=($attr['WIDTH']/4);
                else $this->tdwidth=40; // Set to your own width if you need bigger fixed cells
                if( !empty($attr['HEIGHT']) ) $this->tdheight=($attr['HEIGHT']/6);
                else $this->tdheight=6; // Set to your own height if you need bigger fixed cells
                if( !empty($attr['ALIGN']) ) {
                    $align=$attr['ALIGN'];
                    if($align=='LEFT') $this->tdalign='L';
                    if($align=='CENTER') $this->tdalign='C';
                    if($align=='RIGHT') $this->tdalign='R';
                }
                else $this->tdalign='L'; // Set to your own
                if( !empty($attr['BGCOLOR']) ) {
                    $coul=hex2dec($attr['BGCOLOR']);
                    $this->SetFillColor($coul['R'],$coul['G'],$coul['B']);
                    $this->tdbgcolor=true;
                }
                $this->tdbegin=true;
                break;

            case 'HR':
                if( !empty($attr['WIDTH']) )
                    $Width = $attr['WIDTH'];
                else
                    $Width = $this->w - $this->lMargin-$this->rMargin;
                $x = $this->GetX();
                $y = $this->GetY();
                $this->SetLineWidth(0.2);
                $this->Line($x,$y,$x+$Width,$y);
                $this->SetLineWidth(0.2);
                $this->Ln(1);
                break;
            case 'STRONG':
                $this->SetStyle('B',true);
                break;
            case 'EM':
                $this->SetStyle('I',true);
                break;
            case 'B':
            case 'I':
            case 'U':
                $this->SetStyle($tag,true);
                break;
            case 'A':
                $this->HREF=$attr['HREF'];
                break;
            case 'IMG':
                if(isset($attr['SRC']) && (isset($attr['WIDTH']) || isset($attr['HEIGHT']))) {
                    if(!isset($attr['WIDTH']))
                        $attr['WIDTH'] = 0;
                    if(!isset($attr['HEIGHT']))
                        $attr['HEIGHT'] = 0;
                    $this->Image($attr['SRC'], $this->GetX(), $this->GetY(), px2mm($attr['WIDTH']), px2mm($attr['HEIGHT']));
                }
                break;
            case 'BLOCKQUOTE':
            case 'BR':
                $this->Ln(5);
                break;
            case 'P':
                $this->Ln(10);
                break;
            case 'FONT':
                if (isset($attr['COLOR']) && $attr['COLOR']!='') {
                    $coul=hex2dec($attr['COLOR']);
                    $this->SetTextColor($coul['R'],$coul['G'],$coul['B']);
                    $this->issetcolor=true;
                }
                if (isset($attr['FACE']) && in_array(strtolower($attr['FACE']), $this->fontlist)) {
                    $this->SetFont(strtolower($attr['FACE']));
                    $this->issetfont=true;
                }
                if (isset($attr['FACE']) && in_array(strtolower($attr['FACE']), $this->fontlist) && isset($attr['SIZE']) && $attr['SIZE']!='') {
                    $this->SetFont(strtolower($attr['FACE']),'',$attr['SIZE']);
                    $this->issetfont=true;
                }
                break;
        }
    }

    function CloseTag($tag)
    {
        //Closing tag
        if($tag=='SUP') {
        }

        if($tag=='TD') { // TD-END
            $this->tdbegin=false;
            $this->tdwidth=0;
            $this->tdheight=0;
            $this->tdalign="L";
            $this->tdbgcolor=false;
        }
        if($tag=='TR') { // TR-END
            $this->Ln();
        }
        if($tag=='TABLE') { // TABLE-END
            $this->tableborder=0;
        }

        if($tag=='STRONG')
            $tag='B';
        if($tag=='EM')
            $tag='I';
        if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,false);
        if($tag=='A')
            $this->HREF='';
        if($tag=='FONT'){
            if ($this->issetcolor==true) {
                $this->SetTextColor(0);
            }
            if ($this->issetfont) {
                $this->SetFont('arial');
                $this->issetfont=false;
            }
        }
    }

    function SetStyle($tag, $enable)
    {
        //Modify style and select corresponding font
        $this->$tag+=($enable ? 1 : -1);
        $style='';
        foreach(array('B','I','U') as $s) {
            if($this->$s>0)
                $style.=$s;
        }
        $this->SetFont('',$style);
    }

    function PutLink($URL, $txt)
    {
        //Put a hyperlink
        $this->SetTextColor(0,0,255);
        $this->SetStyle('U',true);
        $this->Write(5,$txt,$URL);
        $this->SetStyle('U',false);
        $this->SetTextColor(0);
    }
    //=====================================================

}

// Instantiation of inherited class
$pdf = new PDF('L','mm','A4');
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial','',10);

//table headers and table values
$table_headings = array('Overall Standing', 'District', 'Tehsil', 'Mauza','Cost','Scheme Name','Nearest Primary City','Nearest SEZ/Industrial Estate','Floods and Risk Area','Protected Area','Result');
//$table_values = array('64 out of 100','Sialkot','Daska','Kot Ghumman','100000','Scheme1','Sialkot 8.88(km)','S.I.E Sialkot 1Trading Agency ( Nestle)','No','No','Aligned with PSS');
$table_values = $arr_allData[0];

//table print
$counter = 0;
$numItems = count($table_values);
$alignedWithPSS = '';
foreach(array_combine($table_headings, $table_values) as $heading => $value)
{
    $counter ++;
    if($counter % 2 == 1)
    {
        $pdf->SetFillColor(240 , 240, 240);//gray
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(70,12,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(70,12,$value,0,0,'L',true);

    }
    else
    {
        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(70,12,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(70,12,$value,0,0,'L',true);

    }

    if($numItems == $counter)
    {
        $alignedWithPSS = $value;
    }

    $pdf->Ln();
}

$pin_point1 = 'pin_point1.png';
$dataURI    = $arr_allData[25]["pin_point1"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($pin_point1,$decodedImg);
$pdf->Ln();
$pdf->Image($pin_point1,155,38,132,110);
unlink($pin_point1);


$pdf->Ln();

$pdf->AddPage();

$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'PROPOSED SITE READINESS GAUGES',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);

$gauge_1_para = "Community includes schools and hospitals (DHQs, THQs, GHs, etc.) in the areas surrounding the site.";
$gauge_2_para = "Connectivity & Logistics accounts for the availability and access to airports, dry ports, railways, interchanges, highways, primary and secondary roads. It also calculates transport time from the chosen location.";
$gauge_3_para = "Environment studies the ground water quality, air quality and temperatures around the chosen location.";
$gauge_4_para = "Human Capital accounts for the settlements, government colleges, universities and TEVTA institutes in the areas surrounding the chosen location.";
$gauge_5_para = "Institutions include district headquarters and police stations in the surrounding areas.";
$gauge_6_para = "Markets examines industry concentration, population and population growth rate, primary and intermediate cities in areas surrounding the site.";
$gauge_7_para = "Raw Materials looks into the extent to which minerals, mines and markets are easily accessible from the chosen location.";
$gauge_8_para = "Utilities include access to drainage networks, electricity networks, grid stations, gas pipelines, gas stations, ground water tables, irrigation networks and solar radiations.";

$TotalGauge = 'TotalGauge.png';
$dataURI    = $arr_allData[14]["TotalGauge"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($TotalGauge,$decodedImg);
$pdf->Image($TotalGauge,115,20,65,27);
unlink($TotalGauge);
$pdf->SetXY(127,48);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetFont('Arial','',10,0);
$pdf->Cell(40,5,$alignedWithPSS,0,0,'C');

$Gauge_1 = 'Gauge_1.png';
$dataURI    = $arr_allData[6]["Gauge_1"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_1,$decodedImg);
$pdf->Image($Gauge_1,15,52,65,27);
unlink($Gauge_1);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(37,58);
$pdf->Cell(20,50,$arr_allData[6]["Gauge_1_name"],0,0,'C');
$pdf->SetXY(38,68);
$pdf->Cell(20,40,$arr_allData[6]["Gauge_1_value"]."%",0,0,'C');
$pdf->SetXY(20,92);
$pdf->MultiCell(56,4,$gauge_1_para,0,'C',false);

$Gauge_2 = 'Gauge_2.png';
$dataURI    = $arr_allData[7]["Gauge_2"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_2,$decodedImg);
$pdf->Image($Gauge_2,85,52,65,27);
unlink($Gauge_2);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(100,58);
$pdf->Cell(35,50,$arr_allData[7]["Gauge_2_name"],0,0,'C');
$pdf->SetXY(88,68);
$pdf->Cell(60,40,$arr_allData[7]["Gauge_2_value"]."%",0,0,'C');
$pdf->SetXY(90,92);
$pdf->MultiCell(56,4,$gauge_2_para,0,'C',false);

$Gauge_3 = 'Gauge_3.png';
$dataURI    = $arr_allData[8]["Gauge_3"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_3,$decodedImg);
$pdf->Image($Gauge_3,152,52,65,27);
unlink($Gauge_3);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(168,58);
$pdf->Cell(35,50,$arr_allData[8]["Gauge_3_name"],0,0,'C');
$pdf->SetXY(155,68);
$pdf->Cell(60,40,$arr_allData[8]["Gauge_3_value"]."%",0,0,'C');
$pdf->SetXY(158,92);
$pdf->MultiCell(56,4,$gauge_3_para,0,'C',false);


$Gauge_4 = 'Gauge_4.png';
$dataURI    = $arr_allData[9]["Gauge_4"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_4,$decodedImg);
$pdf->Image($Gauge_4,220,52,65,27);
unlink($Gauge_4);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(234,58);
$pdf->Cell(35,50,$arr_allData[9]["Gauge_4_name"],0,0,'C');
$pdf->SetXY(222,68);
$pdf->Cell(60,40,$arr_allData[9]["Gauge_4_value"]."%",0,0,'C');
$pdf->SetXY(225,92);
$pdf->MultiCell(56,4,$gauge_4_para,0,'C',false);

$Gauge_5 = 'Gauge_5.png';
$dataURI    = $arr_allData[10]["Gauge_5"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_5,$decodedImg);
$pdf->Image($Gauge_5,15,125,65,27);
unlink($Gauge_5);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(37,130);
$pdf->Cell(20,50,$arr_allData[10]["Gauge_5_name"],0,0,'C');
$pdf->SetXY(38,140);
$pdf->Cell(20,40,$arr_allData[10]["Gauge_5_value"]."%",0,0,'C');
$pdf->SetXY(20,163);
$pdf->MultiCell(56,4,$gauge_5_para,0,'C',false);

$Gauge_6 = 'Gauge_6.png';
$dataURI    = $arr_allData[11]["Gauge_6"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_6,$decodedImg);
$pdf->Image($Gauge_6,85,125,65,27);
unlink($Gauge_6);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(107,130);
$pdf->Cell(20,50,$arr_allData[11]["Gauge_6_name"],0,0,'C');
$pdf->SetXY(107,140);
$pdf->Cell(20,40,$arr_allData[11]["Gauge_6_value"]."%",0,0,'C');
$pdf->SetXY(90,163);
$pdf->MultiCell(56,4,$gauge_6_para,0,'C',false);

$Gauge_7 = 'Gauge_7.png';
$dataURI    = $arr_allData[12]["Gauge_7"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_7,$decodedImg);
$pdf->Image($Gauge_7,152,125,65,27);
unlink($Gauge_7);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(175,130);
$pdf->Cell(20,50,$arr_allData[12]["Gauge_7_name"],0,0,'C');
$pdf->SetXY(175,140);
$pdf->Cell(20,40,$arr_allData[12]["Gauge_7_value"]."%",0,0,'C');
$pdf->SetXY(158,163);
$pdf->MultiCell(56,4,$gauge_7_para,0,'C',false);

$Gauge_8 = 'Gauge_8.png';
$dataURI    = $arr_allData[13]["Gauge_8"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($Gauge_8,$decodedImg);
$pdf->Image($Gauge_8,220,125,65,27);
unlink($Gauge_8);
$pdf->SetFillColor(255, 0, 0);
$pdf->SetXY(243,130);
$pdf->Cell(20,50,$arr_allData[13]["Gauge_8_name"],0,0,'C');
$pdf->SetXY(243,140);
$pdf->Cell(20,40,$arr_allData[13]["Gauge_8_value"]."%",0,0,'C');
$pdf->SetXY(225,163);
$pdf->MultiCell(56,4,$gauge_8_para,0,'C',false);

$pdf->AddPage();

$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'DISTANCE TO KEY INFRASTRUCTURE',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);

$pdf->Ln(13);

//table headers and table values
$table_headings = array('Highway Motorway', 'Railroad', 'Airport', 'Trucking Stations Interchanges','Dryports','Education','Hospitals','Floods','Gas Network','Electricity Network');
$table_values = $arr_allData[5];

//table print
$counter = 0;
$numItems = count($table_values);
foreach(array_combine($table_headings, $table_values) as $heading => $value)
{
    $counter ++;
    if($counter % 2 == 1)
    {
        $pdf->SetFillColor(240 , 240, 240);//gray
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(137,6,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(137,6,$value,0,0,'L',true);

    }
    else
    {
        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','B',10,0);
        $pdf->Cell(137,6,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(137,6,$value,0,0,'L',true);

    }

    $pdf->Ln();
}

$pdf->Ln(3);

$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'SITE POSITIONING WITH RESPECT TO PSS PRIORITIZATION',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);

$pdf->Ln(12);

$pdf->Cell(140,5,'PROPOSED KEY INDUSTRIAL SECTORS AS INFORMED BY PSS',0,0,'C',false);
$pdf->Ln(5);
//table print
$table_values = $arr_allData[4];
foreach($table_values as $value)
{
    $pdf->SetFillColor(255 , 255, 255);//white
    $pdf->SetFont('','B',10,0);
    $pdf->Cell( 20, 7, $pdf->Image(addImageToIndustry($value), $pdf->GetX(), $pdf->GetY(), 5), 0, 0, 'C', false );
    $pdf->SetFont('','',10,0);
    $pdf->SetTextColor(0  , 0, 0);
    $pdf->Cell(115,7,$value,0,0,'L',true);

    $pdf->Ln();

}

function addImageToIndustry($val){
    if($val=="Clothing") {
        $icon = '../../images/clothing.png';
    } else if($val=="Textiles"){
        $icon = '../../images/textile.png';
    }else if($val=="Non-electronic Machinery"){
        $icon = '../../images/manufacturing.png';
    }else if($val=="Miscellaneous Manufacturing"){
        $icon = '../../images/electronic component.png';
    }else if($val=="Transport Equipment"){
        $icon = '../../images/transport.png';
    }else if($val=="Chemicals"){
        $icon = '../../images/chemical.png';
    }else if($val=="Basic Manufactures"){
        $icon = '../../images/basic_manufacture.png';
    }else if($val=="Processed Food"){
        $icon = '../../images/food.png';
    }else if($val=="Electronic Components"){
        $icon = '../../images/electrnic_machinery.png';
    }else if($val=="IT and Consumer Electronics"){
        $icon = '../../images/IT & Consumer.png';
    }else if($val=="Leather Products"){
        $icon = '../../images/manufacturing.png';
    }else{
        $icon = '../../images/clothing.png';
    }
    return $icon;
}

$pin_point2 = 'pin_point2.png';
$dataURI    = $arr_allData[26]["pin_point2"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($pin_point2,$decodedImg);
$pdf->Image($pin_point2,150,100,135,80);
unlink($pin_point2);

$pdf->AddPage();

$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'EXISTING TOP INDUSTRIES IN DISTRICT OF PROPOSED SITE',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);

$donut_1 = 'donut_1.png';
$dataURI    = $arr_allData[24]["donut_1"];

$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($donut_1,$decodedImg);
$pdf->Image($donut_1,10,25,130,70);
unlink($donut_1);

$pin_point3 = 'pin_point3.png';
$dataURI    = $arr_allData[27]["pin_point3"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($pin_point3,$decodedImg);
$pdf->Image($pin_point3,150,25,135,70);
unlink($pin_point3);

$pdf->Ln(30);
$pdf->Ln(30);
$pdf->Ln(30);

$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'ENVIRONMENT ASSESSMENT',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);

$pdf->Ln(12);

$pdf->SetFont('Arial','B',11,0);
$pdf->Cell(50,10,'Legal Requirement',0,0,'L',false);
$pdf->Ln();
$pdf->SetFont('Arial','',11,0);
$pdf->SetFillColor(240 , 240, 240);//gray
$pdf->Cell(245,7,'Legal Requirement for Environment Assessment :',0,0,'L',true);
$pdf->Cell(30,7,$arr_allData[1]["legalReq"],0,0,'L',true);
$pdf->Ln();
$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(0 , 0, 0);
$pdf->Cell(140,10,'Sectoral Assessment',0,0,'L',false);
$pdf->Cell(135,10,'Spatial Assessment',0,0,'L',false);
$pdf->Ln();


//table headers and table values
$sectoral_assess_headings = array('Flood zone','Residential Area','Prime Agri Land','Closest Major cities');
$sectoral_assess_values = $arr_allData[2];

//table print
$itrator = 0;
$numItems = count($sectoral_assess_values);
foreach(array_combine($sectoral_assess_headings, $sectoral_assess_values) as $heading => $value)
{
    $itrator ++;
    if($itrator % 2 == 1)
    {
        $pdf->SetFillColor(240 , 240, 240);//gray
        $pdf->SetFont('','',10,0);
        $pdf->Cell(115,8,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(20,8,$value,0,0,'L',true);

    }
    else
    {
        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','',10,0);
        $pdf->Cell(115,8,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(20,8,$value,0,0,'L',true);

    }

    $pdf->Ln();
}

$pdf->Ln();

$spatial_assess_headings = array('Location Inside Conservation Area','Location in Protected Area','Location in Protected Habitat','Location in Flood Area','Water Quality Index','Groundwater Depth');
$spatial_assess_values = $arr_allData[3];
//table print
$i = 0;
$rowsHeight = array(139,147,155,163,171,179);
$numItems = count($spatial_assess_values);
foreach(array_combine($spatial_assess_headings, $spatial_assess_values) as $heading => $value)
{

    if($value == "no value")
    {
        $value = '';
    }

    if($i % 2 == 1)
    {
        $pdf->SetXY(150,$rowsHeight[$i]);
        $pdf->SetFillColor(240 , 240, 240);//gray
        $pdf->SetFont('','',10,0);
        $pdf->Cell(115,8,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(20,8,$value,0,0,'L',true);

    }
    else
    {
        $pdf->SetXY(150,$rowsHeight[$i]);
        $pdf->SetFillColor(255 , 255, 255);//white
        $pdf->SetFont('','',10,0);
        $pdf->Cell(115,8,$heading,0,0,'L',true);
        $pdf->SetFont('','',10,0);
        $pdf->SetTextColor(0  , 0, 0);
        $pdf->Cell(20,8,$value,0,0,'L',true);

    }
    $i ++;

    $pdf->Ln();
}

$pdf->Ln(3);

$pdf->AddPage();

$pin_point4 = 'pin_point4.png';
$dataURI    = $arr_allData[28]["pin_point4"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($pin_point4,$decodedImg);
$pdf->Image($pin_point4,10,10,130,80);
unlink($pin_point4);

$pin_point5 = 'pin_point5.png';
$dataURI    = $arr_allData[29]["pin_point5"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($pin_point5,$decodedImg);
$pdf->Image($pin_point5,150,10,135,80);
unlink($pin_point5);

$pdf->Ln(28);
$pdf->Ln(28);
$pdf->Ln(28);

$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'DISTRICT READINESS FOR SEZs/IE: PRESENT RANKINGS AMONG 36 DISTRICTS',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);

$pdf->Ln(12);

$thermo_0 = 'thermo_0.png';
$dataURI    = $arr_allData[15]["thermo_0"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_0,$decodedImg);
$pdf->Image($thermo_0,5,115,20,52);
unlink($thermo_0);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(7,167);
$pdf->Cell(17,5,'Community',0,0,'L',false);

$thermo_1 = 'thermo_1.png';
$dataURI    = $arr_allData[16]["thermo_1"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_1,$decodedImg);
$pdf->Image($thermo_1,27,115,20,52);
unlink($thermo_1);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(28,167);
$pdf->Cell(18,5,'Connectivity',0,0,'L',false);

$thermo_2 = 'thermo_2.png';
$dataURI    = $arr_allData[17]["thermo_2"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_2,$decodedImg);
$pdf->Image($thermo_2,50,115,20,52);
unlink($thermo_2);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(52,167);
$pdf->Cell(18,5,'Enviroment',0,0,'L',false);

$thermo_3 = 'thermo_3.png';
$dataURI    = $arr_allData[18]["thermo_3"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_3,$decodedImg);
$pdf->Image($thermo_3,73,115,20,52);
unlink($thermo_3);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(78,167);
$pdf->Cell(12,5,'Human ',0,0,'L',false);
$pdf->SetXY(78,171);
$pdf->Cell(12,5,'Capital',0,0,'L',false);

$thermo_4 = 'thermo_4.png';
$dataURI    = $arr_allData[19]["thermo_4"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_4,$decodedImg);
$pdf->Image($thermo_4,95,115,20,52);
unlink($thermo_4);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(99,167);
$pdf->Cell(16,5,'Institutoin',0,0,'L',false);

$thermo_5 = 'thermo_5.png';
$dataURI    = $arr_allData[20]["thermo_5"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_5,$decodedImg);
$pdf->Image($thermo_5,119,115,20,52);
unlink($thermo_5);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(125,167);
$pdf->Cell(14,5,'Markets',0,0,'L',false);

$thermo_6 = 'thermo_6.png';
$dataURI    = $arr_allData[21]["thermo_6"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_6,$decodedImg);
$pdf->Image($thermo_6,142,115,20,52);
unlink($thermo_6);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(150,167);
$pdf->Cell(9,5,'Row ',0,0,'L',false);
$pdf->SetXY(148,171);
$pdf->Cell(13,5,'Material',0,0,'L',false);

$thermo_7 = 'thermo_7.png';
$dataURI    = $arr_allData[22]["thermo_7"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_7,$decodedImg);
$pdf->Image($thermo_7,167,115,20,52);
unlink($thermo_7);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(172,167);
$pdf->Cell(14,5,'Utilities',0,0,'L',false);

$thermo_8 = 'thermo_8.png';
$dataURI    = $arr_allData[23]["thermo_8"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($thermo_8,$decodedImg);
$pdf->Image($thermo_8,188,115,20,52);
unlink($thermo_8);
$pdf->SetFont('Arial','',9,0);
$pdf->SetXY(194,167);
$pdf->Cell(12,5,'OverAll',0,0,'L',false);
$pdf->SetXY(196,171);
$pdf->Cell(8,5,'Rank',0,0,'L',false);

$pin_point12 = 'pin_point12.png';
$dataURI    = $arr_allData[30]["pin_point12"];
$dataPieces = explode(',',$dataURI);
$encodedImg = $dataPieces[1];
$decodedImg = base64_decode($encodedImg);
file_put_contents($pin_point12,$decodedImg);
$pdf->Image($pin_point12,210,115,75,60);
unlink($pin_point12);

$pdf->AddPage();

$pdf->SetFont('Arial','B',11,0);
$pdf->SetFillColor(78, 100, 140);
$pdf->SetTextColor(255, 255, 255);
$pdf->Cell(275,10,'CONTACT DETAILS AND RESPONSIBLE OFFICIALS',0,0,'C',true);
$pdf->SetTextColor(0, 0, 0);

$pdf->Ln(15);

$pdf->SetFont('','',10,0);
$pdf->SetDrawColor(166,166,166);
$pdf->Cell(275,10,'Name:','T,B',0,'L',false);
$pdf->Ln();
$pdf->Cell(275,10,'Designation:','T,B',0,'L',false);
$pdf->Ln();
$pdf->Cell(275,10,'Organization:','T,B',0,'L',false);
$pdf->Ln();
$pdf->Cell(275,10,'Signatures:','T,B',0,'L',false);
$pdf->Ln();
$pdf->Cell(275,10,'Date:','T,B',0,'L',false);

$pdf->Ln(15);

$contents = '<table border="1">
	<tr>
		<td width="1000" height="40" ALIGN="CENTER">Ranking Criteria for Location Selection for Industries</td>
	</tr>
	<tr>
		<td width="500" height="40" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>LOGISTICS</STRONG></font></td>
		<td width="500" height="40" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>COMMUNITY</STRONG></font></td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Highways/Motorways</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.15%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Education level</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.19%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">Within 2 KMs</td>
		<td width="100" height="40">100%</td>
		<td width="500" height="40">Number of university/Colleges in 50 KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">2-5 KMs</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">Above 5 KMs</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-8 KMs</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">4 KMs</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">8-10 KMs</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">3 KMs</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">Above 10 KMs</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">2 KMs</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Railroad/Station</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.58%</STRONG></td>
		<td width="400" height="40">below 2 KMs</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">Within 5 KMs</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Hospital</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.92%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">5-15 KMs</td>
		<td width="100" height="40">75%</td>
		<td width="500" height="40">General Hospital Distance in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">15-30 KMs</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">Within 10 KMs</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">30-45 KMs</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">10-25 KMs</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">Above 45 KMs</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">25-40 KMs</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Airport</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.05%</STRONG></td>
		<td width="400" height="40">40-50 KMs</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="500" height="40">Commercial/Logistics</td>
		<td width="400" height="40">Above 50 KMs</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">Within 25 KMs</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Hotel/Motel</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.19%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">25-40 KMs</td>
		<td width="100" height="40">75%</td>
		<td width="500" height="40">3 star hotel/Guest house in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">40-60 KMs</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">Within 5 KMs</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">60-100 KMs</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">5-10 KMs</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">Above 100 KMs</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">10-20 KMs</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Trucking Stations/Interchanges</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.05%</STRONG></td>
		<td width="400" height="40">20-40 KMs</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">0-5 KMs</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Above 40 KMs</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-8 KMs</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Community Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>7%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">8-15 KMs</td>
		<td width="100" height="40">50%</td>
		<td width="500" height="40"><FONT color="#ffffff">Empty Cell</FONT></td>
	</tr>
	<tr>
		<td width="400" height="40">15-25 KMs</td>
		<td width="100" height="40">25%</td>
		<td width="500" height="40" ALIGN="CENTER" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>INDUSTRIAL SITE</STRONG></FONT></td>
	</tr>
	<tr>
		<td width="400" height="40">Above 25 KMs</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Land Cost</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.72%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Shipping Cost/DryPort</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.58%</STRONG></td>
		<td width="500" height="40">Per Acre Cost</td>
	</tr>
	<tr>
		<td width="400" height="40">Within 20 KMs</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Very Low</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">20-40 KMs</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">Low</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">40-60 KMs</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">Medium</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">60-100 KMs</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">High</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">Above 100 KMs</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">Very High</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Warehouse/Storage(in Dist)</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.05%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Developed Park/Zone</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.63%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">Highly available</td>
		<td width="100" height="40">100%</td>
		<td width="500" height="40">Ies/SEZs status</td>
	</tr>
	<tr>
		<td width="400" height="40">Medium Available</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">Highly Developed</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">Available</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">Developed</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">Low Available</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">Partly Developed</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">No Available</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">Under dDeveloped</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Transport Time</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.05%</STRONG></td>
		<td width="400" height="40">Not Developed</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">Carpted Road/Double with limited traffic</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Quality (Risks involved)</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.72%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">Carpted with Heavy Traffic</td>
		<td width="100" height="40">75%</td>
		<td width="500" height="40">Soil Quality/Conditions</td>
	</tr>
	<tr>
		<td width="400" height="40">Non Carpted with low Traffic</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">Highly Suitable for Mega Constructions</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">Non Carpted with heavy Traffic</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">Suitable for Mega Constructions</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">No Proper Road/Connectivity</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">Low Suitable for Mega Constructions</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Logistics Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>11.0%</STRONG></td>
		<td width="400" height="40">Very Low Suitable for Mega Constructions</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="500" height="40"><FONT color="#ffffff">Empty Cell</FONT></td>
		<td width="400" height="40">Not Suitable</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
	    <td width="500" height="40"><FONT color="#ffffff">Empty Cell</FONT></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Industrial Site Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>9.0%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40" ALIGN="CENTER" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>LABOUR</STRONG></FONT></td>
		<td width="500" height="40" ALIGN="CENTER" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>ENVIRONMENT</STRONG></FONT></td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Labour Proximity</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>6.15%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Rainfall</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>0.61%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">(0.3 million inhabitants in KMs)</td>
		<td width="500" height="40">(Frequency and Intensity)</td>
	</tr>
	<tr>
		<td width="400" height="40">within 2</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Normal</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">2-5</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">Heavy/Low</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-8</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">Abnormal/No</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">8-10</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Humidity</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>0.6%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">above 10</td>
		<td width="100" height="40">0%</td>
		<td width="500" height="40">Level of Humid</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Labour Literacy level</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.23%</STRONG></td>
		<td width="400" height="40">Normal</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="500" height="40">Literacy rate</td>
		<td width="400" height="40">Medium</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">Above average</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Extreme</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">average</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Temprature</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.23%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">below average</td>
		<td width="100" height="40">50%</td>
		<td width="500" height="40">Temprature level</td>
	</tr>
	<tr>
		<td width="400" height="40">low</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">Normal</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">very low</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">High</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Skilled Labour</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.08%</STRONG></td>
		<td width="400" height="40">Very High</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="500" height="40">(Technical Institutes Turnover as % of Pop)</td>
		<td width="400" height="40">Extreme</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">Above average</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Floods</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.7%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">average</td>
		<td width="100" height="40">75%</td>
		<td width="500" height="40">Floods frequency</td>
	</tr>
	<tr>
		<td width="400" height="40">below average</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">No floods</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">low</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">Rare</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">very low</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">Occasional</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Labour Cost</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.85%</STRONG></td>
		<td width="400" height="40">Normal</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="500" height="40">(Wages data/LFS)</td>
		<td width="400" height="40">Floody</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">Highly available at MWR</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Pollution</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.68%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">Available at MWR</td>
		<td width="100" height="40">75%</td>
		<td width="500" height="40">Existing polution level in the area</td>
	</tr>
	<tr>
		<td width="400" height="40">Medium available @ MWR</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">No Polution</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">Low available at MWR</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">Low Polution</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">Very Low available @ MWR</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">Highl Polution</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Labour Weighttt</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>12%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Ecology</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.45%</STRONG></td>
	</tr>
	<tr>
	    <td width="500" height="40"><FONT color="#FFFFFF">Empty Cell</FONT></td>
	    <td width="500" height="40">Ecology level</td>
	</tr>
	<tr>
		<td width="500" height="40" ALIGN="CENTER" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>MARKETS</STRONG></FONT></td>
		<td width="400" height="40">Green</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Existing Consumer Market</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.08%</STRONG></td>
		<td width="400" height="40">Yellow</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="500" height="40">3 million Pop. Market distance in KMs</td>
		<td width="400" height="40">Red</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">Within 10</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Environment Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>12%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">75%</td>
		<td width="500" height="40"><FONT color="#FFFFFF">Empty Cell</FONT></td>
	</tr>
	<tr>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">50%</td>
		<td width="500" height="40" ALIGN="CENTER" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>RAW MATERIAL</STRONG></FONT></td>
	</tr>
	<tr>
		<td width="400" height="40">30-40</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Material Availability</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>7.50%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">above 40</td>
		<td width="100" height="40">0%</td>
		<td width="500" height="40">Agri and Minerals hub within the area</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Industry Concentration</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>5.54%</STRONG></td>
		<td width="400" height="40">Highly available/Rich</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="500" height="40">Other Industrial Cluster/Zone in KMs</td>
		<td width="400" height="40">Available in the area</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">within 5</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Medium available</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-10</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">Low available</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">10-15</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">Very Low availablity</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">15-25</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Material Proximity</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>4.50%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">above 25</td>
		<td width="100" height="40">0%</td>
		<td width="500" height="40">(Access of hub/Market in KMs)</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Population Growth</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.69%</STRONG></td>
		<td width="400" height="40">Within 10</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="500" height="40">Adjacent City Growth</td>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">Above average</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">average</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">30-40</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">below average</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">above 40</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40">low</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Components/Supplies</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.00%</STRONG></td>
	</tr>
	<tr>
		<td width="400" height="40">very low</td>
		<td width="100" height="40">0%</td>
		<td width="500" height="40">DHQ/Major City distance in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Market Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>12%</STRONG></td>
		<td width="400" height="40">within 25</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="500" height="40"><FONT color="#FFFFFF">Empty Cell</FONT></td>
		<td width="400" height="40">25-60</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
	    <td width="500" height="40"><FONT color="#FFFFFF">Empty Cell</FONT></td>
		<td width="400" height="40">60-100</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
	    <td width="500" height="40"><FONT color="#FFFFFF">Empty Cell</FONT></td>
		<td width="400" height="40">100-200</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
	    <td width="500" height="40"><FONT color="#FFFFFF">Empty Cell</FONT></td>
		<td width="400" height="40">above 200</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
	    <td width="500" height="40"><FONT color="#FFFFFF">Empty Cell</FONT></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Raw Material Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>15%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40" ALIGN="CENTER" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>UTILITIES</STRONG></FONT></td>
		<td width="500" height="40" ALIGN="CENTER" bgcolor="#5B9BD5"><FONT color="#FFFFFF"><STRONG>INSTITUTIONSL</STRONG></FONT></td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Gas Network</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.0%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Public Sector Dept/Organizations</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>4.68%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Pipeline access in KMs</td>
		<td width="400" height="40">Distance from DHQ in KMs</td>
		<td width="100" height="40"></td>
	</tr>
	<tr>
		<td width="400" height="40">within 1</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Within 10</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">2-5</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-10</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">10-15</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">30-50</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">above 15</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">above 50</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Electricity Network</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.0%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Banks/DFIs</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.17%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Elecricity Grid distance in KMs</td>
		<td width="500" height="40">Availability of Bank Branches in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">within 1</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Within 10</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">2-5</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-10</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">10-15</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">30-40</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">above 15</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">above 40</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Water Supply</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.0%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Business Association/Chamber</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>0.59%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Water Supply network/or Surface water</td>
		<td width="500" height="40">Associations/Chambers offices in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">within 1</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Within 10</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">2-5</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-10</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">10-15</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">30-40</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">above 15</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">above 40</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Sewerage Facility</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.0%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Training Centre/R&amp;D Centre, Labortories</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>3.51%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Drainages/Sanitation access in KMs</td>
		<td width="500" height="40">Tevta/Labortaory Centres in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">within 1</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Within 10</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">2-5</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-10</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">10-15</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">30-50</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">above 15</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">above 50</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Electricity Supply Quality</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>2.0%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Police Station</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.76%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Load shedding frequency</td>
		<td width="500" height="40">Police Station in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">No Loadshedding</td>
		<td width="100" height="40">100%</td>
		<td width="400" height="40">Within 10</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">rare trippings</td>
		<td width="100" height="40">75%</td>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">Occasional LS</td>
		<td width="100" height="40">50%</td>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">Frequent LS</td>
		<td width="100" height="40">25%</td>
		<td width="400" height="40">30-40</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">Heavy LS</td>
		<td width="100" height="40">0%</td>
		<td width="400" height="40">above 40</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Gas Supply Quality</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.0%</STRONG></td>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Institutions Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>12%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Gas supply disconnection</td>
		<td width="400" height="40"></td>
		<td width="100" height="40"></td>
	</tr>
	<tr>
		<td width="400" height="40">No curtailment</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">rare pressure issue</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">Seasonal disruptions</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">Occasional disruptions</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">Regular Intreptions</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Ground Water Quality</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>1.5%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Ground water access &amp; quality</td>
	</tr>
	<tr>
		<td width="400" height="40">Very Good</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">Good</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">Not Good</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">Not Useable</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">Not extractable</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Fuel Station</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>0.5%</STRONG></td>
	</tr>
	<tr>
		<td width="500" height="40">Filling station distance in KMs</td>
	</tr>
	<tr>
		<td width="400" height="40">within 5</td>
		<td width="100" height="40">100%</td>
	</tr>
	<tr>
		<td width="400" height="40">5-10</td>
		<td width="100" height="40">75%</td>
	</tr>
	<tr>
		<td width="400" height="40">10-20</td>
		<td width="100" height="40">50%</td>
	</tr>
	<tr>
		<td width="400" height="40">20-30</td>
		<td width="100" height="40">25%</td>
	</tr>
	<tr>
		<td width="400" height="40">above 30</td>
		<td width="100" height="40">0%</td>
	</tr>
	<tr>
		<td width="400" height="40" bgcolor="#DDEBF7"><STRONG>Total Utilities Weight</STRONG></td>
		<td width="100" height="40" bgcolor="#DDEBF7"><STRONG>10%</STRONG></td>
	</tr>
</table>';

$pdf->SetXY(10,90);
$pdf->WriteHTML($contents);
//$pdf->Output();

$pdf->SetAuthor('PSS');
$pdf_file_name = 'PSS'.'Industry'.'.pdf';
$pdf->SetTitle($pdf_file_name);
$pdf->Output('D',$pdf_file_name);
