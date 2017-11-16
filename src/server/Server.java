package server;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;

public class Server {

   public static void main(String[] args) {
	   	try {
	   		ServerSocket sSocket = new ServerSocket(8001);
	   		boolean isStopped = false;
	   		while(!isStopped){
	   		    Socket clientSocket = sSocket.accept();
	   		    PrintWriter out =
                     new PrintWriter(clientSocket.getOutputStream(), true);
                 out.println(new Date().toString());

	   		    //do something with clientSocket
	   		}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
   }
}