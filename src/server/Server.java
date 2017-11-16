package server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;

public class Server {
   public static void main(String[] args) {
	   ServerSocket echoSocket = null;
       PrintWriter out = null;
       BufferedReader in = null;
       try {
           echoSocket = new ServerSocket(8003);
           while(true) {
	           Socket cli = echoSocket.accept();
	           out = new PrintWriter(cli.getOutputStream(), true);
	           in = new BufferedReader(new InputStreamReader(cli.getInputStream()));
	           out.println("Hello Server!");
	           System.out.println(in.readLine());
           }
       } catch (UnknownHostException e) {
           System.err.println("Host Unknown");System.exit(1);
       } catch (IOException e) {
           System.err.println("Couldn't get I/O for the connection.");System.exit(1);
       }
   }
}