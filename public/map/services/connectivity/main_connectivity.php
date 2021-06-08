<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class Pss extends connection
{


    function __construct()
    {
        $this->connectionDB();
		
		$result = $this->get_data();
		echo json_encode($result);
		
		
		
    }

    public $output = array();


    public function get_data()
    {
        $geom=$_REQUEST['geom'];

        $sqldel="delete from tbl_base";
        pg_query($sqldel);
        $sql_ins="INSERT INTO public.tbl_base(geom) VALUES (st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326))";
     //   echo $sql_ins;
            pg_query($sql_ins);

        $sql="select *,st_length(foo.geom) as total_length,
                case
                when len_per >= 75 then 'Category A'
                when (len_per <75 and  len_per >=25) then 'Category B'
                when (len_per <25 and len_per>=0) then 'Category C' end as category
                from (

                with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643)as geom)
                select   st_intersection(foo.geom,st_buffer(bar.geom,100)), (st_length( st_intersection(foo.geom,st_buffer(bar.geom,100))) /st_length(foo.geom))* 100 as len_per,
                    foo.geom as geom
                from transportation.tbl_pss_links bar,foo ORDER BY len_per DESC limit 1

                )foo";

        $sql1="select directness_index , case when directness_index < 1.2 then 2 when directness_index >=1.2 and  directness_index < 1.8 then 1 when   directness_index >= 1.8 then 0 end as score from (
                with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643)as geom)
                    select  st_length(geom)/st_distance(st_startpoint(geom),st_endpoint(geom)) as directness_index from foo
                )foo";

        $sql2="with foo as (select unnest(array['Expressways/Motorways','Highways','none']) as cat),
                bar as (    
                select distinct road_class,  score from ( 
                select road_class, case when road_class = 'Expressways/Motorways' then 2 when road_class = 'Highways' then 1 else 0 end as score from (
                    
                with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326) as geom)
                ,road as (
                select gid,geom, road_class from tbl_road where road_class in ('Expressways/Motorways','Highways')
                union all
                select gid,geom, 'cpec' as road_class  from tbl_cpec
                )
                select distinct on (gid,road_class)gid,road_class  from road,foo where st_intersects (foo.geom,road.geom)
                    
                )foo 
                    )final
                )select cat as road_class,coalesce(score,0) as class_score   from foo left outer join bar on foo.cat = bar.road_class
                order by class_score desc  limit 1";

        $sql3="select *, case when weighted_average <= 50 then 2 when weighted_average>50 and weighted_average<=75 then 1 else 0 end as score from (
                select *,sum(weg_sum)over()/sum(len_km) over() as weighted_average from (
                with res as (
                with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326)as geom)
                    select district_name,tehsil_name,st_length(st_transform(st_intersection(tehsil.geom,foo.geom),32643)	)/1000.00 as len_km from transportation.tbl_tehsil as tehsil,foo where st_intersects(tehsil.geom,foo.geom)	
                )select res.*,len_km*b.ptiai as weg_sum,b.ptiai from res, transportation.ptiai  b where res.district_name = b.district_n and res.tehsil_name = b.tehsil_n
                )foo
                )fin";

//        echo $sql3;
//        exit();

        $sql4="with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom)
                select city_type,
                case when city_type = 'Primary City' then 2
                when city_type= 'Intermediate City' then 1
                else 0 end as score
                from tbl_cities bar,foo where st_intersects(foo.geom,bar.geom1)
                order by score desc limit 1";

                    $sql5 = "select case when class ='East-West' and count(*) over() = 1 then 2 when class ='East-West' and count(*) over() >1 then 1 else 0 end as score from (
                select class, count(*) from (
                select * , case when direction <=90 then 'northeast' when direction>90 and direction<=180 then 'East-West'  when
                direction>180 and direction<=270 then 'southwest' when  direction>270 then 'northwest'  end as class from (
                select * , degrees(ST_Azimuth(st_startpoint(geom), st_endpoint(geom))) as direction from (
                with foo as (select st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643)as geom)
                
                    ,bar as(
                select series as start , lead (series) over() as end_s from (
                            select generate_series(0,1,1.00/(st_length(geom)::integer/100)) as series from foo
                )foo
                    )
                
                
                    select start,end_s,ST_Line_SubString(foo.geom,start,coalesce(end_s,1)) as geom from bar,foo
                )foo
                    )fin)dir group by class
                )final group by class
                order by score desc limit 1";
          //  echo $sql5;





//       echo $sql;
//        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $this->output['categoery'] = pg_fetch_all($result_query);
        }

        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $this->output['directiness'] = pg_fetch_all($result_query1);
        }

        $result_query2 = pg_query($sql2);
        if ($result_query2) {
            $this->output['national_natwork'] = pg_fetch_all($result_query2);
        }

        $result_query3 = pg_query($sql3);
        if ($result_query3) {
            $this->output['ptiai'] = pg_fetch_all($result_query3);
        }
        $result_query4 = pg_query($sql4);
        //echo pg_fetch_all($result_query4);
        if ($result_query4) {
            if(pg_fetch_all($result_query4)==false){
                $res_arr[]= Array('city_type'=>'none','score'=>'0');
                $this->output['major_cities_con'] =$res_arr;
            }
            else {
                $this->output['major_cities_con'] = pg_fetch_all($result_query4);
            }
            //echo $output['major_cities_con'];
        }
        $result_query5 = pg_query($sql5);
        if ($result_query5) {
            if(pg_fetch_all($result_query5)==false){
                $res_arr[]= Array('score'=>'0');
                $this->output['east_west_con'] =$res_arr;
            }
            else {
                $this->output['east_west_con'] = pg_fetch_all($result_query5);
            }
            //echo $output['major_cities_con'];
        }

        $this->getBuffervalues($geom,5000,5);
        $this->getBuffervalues($geom,10000,10);
        $this->getBuffervalues($geom,15000,15);
        $this->getBuffervalues($geom,20000,20);

        $this->closeConnection();
        return json_encode($this->output);
    }


    public function getBuffervalues($geom,$buffer,$km){

        $sql6="select sum(population) as population,sum(population)/10000.00 as score from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom)
                select (st_area(st_intersection(foo.geom,tbl_grid_with_populatiotin.geom))/st_area(tbl_grid_with_populatiotin.geom))*grid_code as population from foo,tbl_grid_with_populatiotin where st_intersects(foo.geom,tbl_grid_with_populatiotin.geom)
                )foo";

        $sql7="select count(*) as total_railway_station, count(*) as score from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom)
                select * from foo,tbl_railway_station_location where st_intersects(foo.geom,tbl_railway_station_location.geom)
                )foo";

        $sql8="select count(*) as total_dryports, count(*) as score from (
                with foo as (select st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer)as geom)
                select * from foo,tbl_dryports where st_intersects(foo.geom,tbl_dryports.geom)
                )foo";

        $sql9="select count(*) as economic_zone , count(*) as score from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom)
                select * from foo,tbl_special_economic_zone where st_intersects(foo.geom,tbl_special_economic_zone.geom)
                )foo";

//        $sql10="select sum(case when road_class='Local Road' then 1
//            when road_class='Secondary Road' then 2
//            when road_class='Primary Road' then 3
//            when road_class='Highways' then 4
//            when road_class='Expressways/Motorways' then 5
//            end)
//            as score from (
//            with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
//                                                                4326),32643),$buffer),4326)as geom)
//            select gid,road_class from foo,tbl_road where st_intersects(foo.geom,tbl_road.geom)
//            )foo";

        $sql10="select sum(case 
            when road_class='Secondary Road' then 2
            when road_class='Primary Road' then 3
            when road_class='Highways' then 4
            when road_class='Expressways/Motorways' then 5
            end)
            as score from (
            with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                4326),32643),$buffer),4326)as geom)
            select gid,road_class from foo,tbl_road where st_intersects(foo.geom,tbl_road.geom)
            )foo;";


        $sql101="select
        sum(case when road_class='Secondary Road' then 1 else 0 END) as \"Secondary_Roads\",
        sum(case when road_class='Primary Road' then 1 else 0 END) as \"Primary_Roads\",
               sum(case when road_class='Highways' then 1 else 0 END) as \"Highways\",
       sum(case when road_class='Expressways/Motorways' then 1 else 0 end) as \"Express_Moterways\"
            from (
            with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                4326),32643),$buffer),4326)as geom)
            select gid,road_class from foo,tbl_road where st_intersects(foo.geom,tbl_road.geom)
            )foo;";

//        echo $sql101;
//        exit();

//        $sql11="select sum(case when type ='collage' then count*2 when type ='university' then count*4 else count end)   from (
//                select
//                type, case when type in ('Highsec','primary') then count/10 else count end  as count  from (
//                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
//                                                                    4326),32643),$buffer),4326)as geom),
//                bar as (
//                select case when  school_level in ('H.Sec.', 'High') then 'Highsec' else 'primary' end as type,geom  from tbl_school
//                union all
//                select 'university' as type, st_transform(geom,4326) from tbl_universities
//                union all
//                select 'collage' as type,geom from tbl_punjab_college
//                )select bar.type,count(*) from foo,bar where st_intersects(foo.geom,bar.geom)
//                group by bar.type
//                )foo
//                )bar";

        $sql11="select 
                sum(case
                WHEN type in ('Highsec') THEN count1 
                when type in ('primary') THEN count1*2
                when type ='collage' then count*3 
                when type ='university' then count*4 
                 end)   
                from ( 
                select 
                type, case when type in ('Highsec','primary') then count/10  end  as count1, 
										case when type in ('university','collage') then count  end  as count
							from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom),
                bar as (
                select case when  school_level in ('H.Sec.', 'High') then 'Highsec' else 'primary' end as type,geom  from tbl_school 
                union all
                select 'university' as type, st_transform(geom,4326) from tbl_universities
                union all
                select 'collage' as type,geom from tbl_punjab_college
                )select bar.type,count(*) from foo,bar where st_intersects(foo.geom,bar.geom)
                group by bar.type
                )foo
                )bar;";


        $sql111="select 
                sum(case when type ='primary' then count  else 0 END) as \"Primary\",
                sum(case when type ='Highsec' then count else 0 END) as \"Secondary\",
                sum(CASE when type ='collage' then count  else 0 END) as \"Colleges\",
                SUM(CASE when type ='university' then count else 0 END) as \"Universities\"   
                from ( 
                                select 
                                type, case when type in ('Highsec','primary','university','collage') then count end  as count  from (
                                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                                    4326),32643),$buffer),4326)as geom),
                                bar as (
                                select case when  school_level in ('H.Sec.', 'High') then 'Highsec' else 'primary' end as type,geom  from tbl_school 
                                union all
                                select 'university' as type, st_transform(geom,4326) from tbl_universities
                                union all
                                select 'collage' as type,geom from tbl_punjab_college
                                )select bar.type,count(*) from foo,bar where st_intersects(foo.geom,bar.geom)
                                group by bar.type
                                )foo
                                )bar;";



        $sql12="select sum(case when type in ('BHU') then count 
		when type ='RHC' then count
		when type ='THQ' then count
		when type ='DHQ' then count
		when type ='Teaching other than DHQ' then count
		else 0 end) as faclities,
		sum(case 
		when type in ('BHU') then count 
		when type ='RHC' then count*2
		when type ='THQ' then count*3
		when type ='DHQ' then count*4
		when type ='Teaching other than DHQ' then count*5
		else 0 end) as score   from ( 
        select 
        type, case when type in ('BHU') then count/10 else count end  as count  from (
        with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                            4326),32643),$buffer),4326)as geom),
        bar as (
        select hce_type_c as type,geom from tbl_health where hce_sub_ty = 'Hospital'
        )select bar.type,count(*) from foo,bar where st_intersects(foo.geom,bar.geom)
        group by bar.type
        )foo
        )bar;";

        $sql121="SELECT 
            sum (case WHEN hce_type_c ='BHU' THEN 1 else 0 END) as \"BHU\",
            sum (case WHEN hce_type_c ='RHC' THEN 1 else 0 END) as \"RHU\",
            SUM( case WHEN hce_type_c ='THQ' THEN 1 else 0 END) as \"THQ\",
            SUM( CASE WHEN hce_type_c ='DHQ' THEN 1 ELSE 0 END) as \"DHQ\",
            SUM(CASE WHEN hce_type_c ='Teaching other than DHQ' THEN 1 ELSE 0 END) AS \"Teaching Hospital\"
        FROM tbl_health 
        WHERE ST_DWithin(geom,
                         (select st_transform(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),4326)),
                 $buffer, false) and hce_sub_ty = 'Hospital';";

        $sql13="select count(*) as total_protected_areas, count(*) as score from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom)
                select distinct a.gid  from foo,tbl_biodiversity_protected_areas a where st_intersects(foo.geom,a.geom)
                )foo";

        $sql14="select count(*) as total_air_ports, count(*) as score from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom)
                select distinct a.gid  from foo,tbl_air_ports a where st_intersects(foo.geom,a.geom)
                )foo";

        $sql15="select  sum(case when type = 'large' then count*3 when type = 'medium' then  count*2 else count  end) as score from (  
                select 
                type, case when type in ('small') then count/100 when type = 'medium' then count/10 else count end   as count  from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom),
                bar as (
                select 'small' as type,geom from tbl_small_scale_industries
                union all
                select 'medium' as type,geom from tbl_medium_scale_industries
                union all
                select 'large' as type,geom from tbl_large_scale_industries
                )select type,count(*) from foo,bar where st_intersects (foo.geom,bar.geom)
                group by type
                )bar
                )final";

      // echo $sql15;


        $sql151="select  
		sum(case when type = 'small' then count else 0 end) as \"Small_Industries\",
		sum(case when type = 'medium' then count else 0 end) as \"Medium_Industries\",		
		sum(case when type = 'large' then count else 0 END) as \"Large_Industries\"
				 
from (  
                select 
                type, case when type in ('small','medium','large') then count end   as count  from (
                with foo as (select st_transform(st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),
                                                                    4326),32643),$buffer),4326)as geom),
                bar as (
                select 'small' as type,geom from tbl_small_scale_industries
                union all
                select 'medium' as type,geom from tbl_medium_scale_industries
                union all
                select 'large' as type,geom from tbl_large_scale_industries
                )select type,count(*) from foo,bar where st_intersects (foo.geom,bar.geom)
                group by type
                )bar
                )final;";

       //echo $sql151;
      // exit();

        $result_query6 = pg_query($sql6);
        if ($result_query6) {
            $pop='population'.$km;
            $this->output[$pop] = pg_fetch_all($result_query6);
        }



        $result_query7 = pg_query($sql7);
        if ($result_query7) {
            $rail='railway'.$km;
            $this->output[$rail] = pg_fetch_all($result_query7);
        }

        $result_query8 = pg_query($sql8);
        if ($result_query8) {
            $dry='dryport'.$km;
            $this->output[$dry] = pg_fetch_all($result_query8);
        }

        $result_query9 = pg_query($sql9);
        if ($result_query9) {
            $zone='economic_zone'.$km;
            $this->output[$zone] = pg_fetch_all($result_query9);

        }

        $result_query10 = pg_query($sql10);
        if ($result_query10) {
            $zone='local_roads'.$km;
            $this->output[$zone] = pg_fetch_all($result_query10);

        }

        $result_query101 = pg_query($sql101);
        if ($result_query101) {
            $zone='roads_details'.$km;
            $this->output[$zone] = pg_fetch_all($result_query101);

        }

        $result_query11 = pg_query($sql11);
        if ($result_query11) {
            $zone='education'.$km;
            $this->output[$zone] = pg_fetch_all($result_query11);

        }

        $result_query111 = pg_query($sql111);
        if ($result_query111) {
            $zone='education_details'.$km;
            $this->output[$zone] = pg_fetch_all($result_query111);

        }

        $result_query12 = pg_query($sql12);
        if ($result_query12) {
            $zone='health'.$km;
            $this->output[$zone] = pg_fetch_all($result_query12);

        }

        $result_query13 = pg_query($sql13);
        if ($result_query13) {
            $zone='protected_area'.$km;
            $this->output[$zone] = pg_fetch_all($result_query13);

        }

        $result_query121 = pg_query($sql121);
        if ($result_query121) {
            $zone='health_details'.$km;
            $this->output[$zone] = pg_fetch_all($result_query121);

        }


        $result_query14 = pg_query($sql14);
        if ($result_query14) {
            $zone='total_air_ports'.$km;
            $this->output[$zone] = pg_fetch_all($result_query14);

        }

        $result_query15 = pg_query($sql15);
        if ($result_query15) {
            $zone='industry'.$km;
            $this->output[$zone] = pg_fetch_all($result_query15);

        }

        $result_query151 = pg_query($sql151);
        if ($result_query151) {
            $zone='industries_detail'.$km;
            $this->output[$zone] = pg_fetch_all($result_query151);

        }



    }
	   
}

$json = new Pss();
//$json->closeConnection();
// echo $json->loadData();


?>