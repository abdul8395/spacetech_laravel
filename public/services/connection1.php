
<?php
class Connection
{
   public $hostname = 'localhost';
    public $database    = 'db_spacetech_indicator';
    public $username     = 'postgres';
   // public $password     = 'Admin123';
    public $password     = 'diamondx';
    public $port     = '5432';

    public $conDB;

    public function connectionDB(){
        

        $this->conDB = pg_connect("host=$this->hostname dbname=$this->database user=$this->username password=$this->password port=$this->port");

        if(!$this->conDB)
        {
            die("connection failed");
        }
    }
    public function closeConnection(){
        pg_close($this->conDB);
    }
}

$con = new Connection();
echo $con->connectionDB();
?>