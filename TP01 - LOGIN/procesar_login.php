<?php
    procesar_login();

    function clean_input($input){
        $data = trim($input);
        $data = stripslashes($input);
        $data = htmlspecialchars($input);
        return $input;
    }

    function procesar_login(){
        try{
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                header('Content-Type: application/json');
                $formulario = file_get_contents('php://input');
                $data = json_decode($formulario, true);
                $email = clean_input($data["email"]);
                $password = clean_input($data['password']);

                if($email === "email@email.com" && $password === "1234"){
                    echo json_encode(1);
                }else{
                    echo json_encode(0);
                }
                
            } else {
                throw new Exception("El método no es POST");
            }
        }catch(Exception $err){
            throw new Exception("Hubo un error al procesar el login");
        }
    }
?>
