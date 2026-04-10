# CCNA notes series (NetworkChuck)

Two or more computer taking = Network
Switch connect computers  

Ethernet cables are layer 01
MAC addresses and frames layer 02
Router is layer 3 
Router replace the private IP with a public  one

Dialog Router has a switch and the router

#### MAC address

##### What is a MAC address ?
- Media access control is a unique identifier hexadecimal code ( 12 digits ) burned into the device NIC
- It is used as a physical address to reliability transport data in a local network. ( ethernet/wifi)(are their networks at dont use either one of them )
- Each NIC in your device has a MAC address , your device prolly has multiple NICs
- Each NIC has it own private IP address assigned by the router 


A switch , takes packets and routes them to the MAC address of the nodes connected to it
stores the MAC address of the devices connected to it in the content-addressable memory
Does it store them when you ping them ?
And when a packet is send , what is inside a packet ? , Does a packet have a sender a receives MAC and IP address ?

The broadcast address, which is the last ip is occupied. When the sender MAC address is not known, it is sent to all devices broadcast address

##### Why MAC and IP addresses?

- If IP address is unique why if would we need a MAC  address
- MAC address is also globally unique number give by the manufacture
- There can be only one IP address per request so you cant send two IPs 
- Therefore we use many addresses so each are acting as a IP and a MAC address like MAC address for the device and 
IP address is for the destination
- We need a MAC address to + IP for a ARP frame




##### How does a switch know a MAC address? 
- ARP(Address Resource Protocol)
- When you ping a device, it's going to send an ARP request,get the MAC address, and then send the packet.
- ARP is sent to all devices connected to a switch. 
- The device that belongs to the IP  send a confirmation with the MAC address ( ig ) while  others ignore it

###### When the router sends an ARP message to the server, it sends its MAC address. So we can send a packet to that server 

##### Why are the first and the last IP addresses reserved, and what they do?
- Gateway address ( router MAC address )
- Broadcast address ( other local devices MAC address )


IP address WAP ( Wireless Access Point )

##### OSI                           
Application          
Presentation
Session 
Transport
Network
Datalink
Physical
                          

##### TCP/IP
Application
Transport--->Segment
Network--->Packet      
Datalink--->Frame
Physical 

##### Common ports
- 443 - HTTPS
- 80 - HTTP
- 22 - ssh
- 54321-psql
- 115-SMTP

##### Talking about the top layers in the OSI

Application layer jobs 
Session layer jobs 
Presentation layer jobs 

Matching application layer protocol( Transport layer protocol )

192.168.x.x most common local private IP address

What are routers( router - router internet )
Routers also have MAC address
So your router talks to the internet.
your NIC( inside the device ) talk to the router. 
If your PC needs to send a request to google.com. 
if needs to said to for its IP address

 UDP( User Datagram Protocol )

 
