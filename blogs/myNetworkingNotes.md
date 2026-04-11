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


##### Switch vs Router
##### Excatly how does the your packet reachs a website from across the world

##### Small local network sharing something
- There is a network with computers A, B, C, D.  
- Computer A wants to send a msg to C.
- A be like,
**"I has a destination IP and no MAC address"**
- It sends a ARP request, not ping. why tho?

###### What is a ping and why not ping? 
- Ping is an ICMP thing.  
- So the ARP msg is send to all the MAC addresses of the network using the broadcast MAC address. 
(FF:FF:FF:FF:FF:FF)
- ARP is basically A yelling on the local network:
"who has IP address 192.168.x.x? Tell me your MAC address."
- Each computer in the network gets the ARP and only C which lives in the IP destination
sends a ARP to A with its MAC address. 
- Now A knows C's MAC address.
- So now A can send the frame to the MAC of C.

So at that point the frame is kinda like:

- Source MAC: A's MAC
- Destination MAC: C's MAC

And inside that frame, the packet is like:

- **Source IP:** A's IP
- **Destination IP:** C's IP

So IP says **who the message is for logically**,  
and MAC says **who gets this frame on this local wire right now**.


###### Whats inside an ARP request?
Very roughly, the important parts are:

- sender MAC address
- sender IP address
- target IP address
- target MAC address

In an **ARP request**, the target MAC is unknown, so its basically empty / all zeroes for that field.  
Because thats literally the thing A is asking for.

So the ARP request is basically:

- "I am IP A, MAC A"
- "Who has IP C?"
- "Please tell me your MAC"


##### What if the destination was not in the LAN, somewhere across the world?

- Lets say A wants to talk to computer E.
- A still has the same problem at first:

**"I have a destination IP, but what MAC address do I send this frame to?"**

- But now A notices that E is not in A's local network.
- ARP broadcasts do not travel across the whole internet.
- So ARPing for Es MAC wont work here
- So what A does in these typa sitiuations is that he sends a ARP request to the router lives in the 
default gateway IP address which is the 192.168.x.1.
- Now the router sends its MAC back and A sends the packet to it.
    
So now A builds a packet like this:

- **Source IP:** A's IP
- **Destination IP:** E's IP

- But for the Ethernet frame, A now needs the MAC of the gateway IP address

- So A ARPs for the router's IP, 
- The router replies with its MAC address.

Then A sends the frame like:

- Source MAC: A's MAC
- Destination MAC: router's MAC

Inside that frame, the packet is still:

- Source IP: A's IP
- Destination IP: E's IP

###### Important:
**MAC addresses change hop by hop.**  
**IP addresses stay about the same from start to end.**


###### How does A know E is not local?

What actually happens is A uses its:

- own IP address
- subnet mask

Example:

- A's IP = `192.168.8.153`
- subnet mask = `255.255.255.0`

That means A's local network is:

`192.168.8.0/24`

- So any address from `192.168.8.1` to `192.168.8.254` is local.
- If E's IP is something outside that range, eg: `8.8.8.8`,

A knows, "nah thats not in my LAN, send this to the gateway"

Its like, 
**"if its not in my subnet, its not directly reachable on my local network"**


###### What does the router do?
Now the router gets the frame from A.

The router looks at the Ethernet frame and sees:

- destination MAC = router's MAC

So the router accepts the frame.

Then it unwraps the Ethernet part and looks at the IP packet inside:

- source IP = A
- destination IP = E

Now router goes:

**"okay, this packet is not for me, but I know where to send it next"**

It checks its **routing table** to figure out the next hop.

Then the router has to send the packet out through another interface.

And once again the router has the same local problem:

**"I know the destination IP I want to move this toward, but on this next local link I need a MAC address."**

So yes, in a way the router repeats the same dance.

If the next hop is another router on a directly connected network, it may ARP for **that next router's MAC**.

Then it builds a **new Ethernet frame**.

This new frame is **not** the same one A originally sent.

The router throws away the old Ethernet frame and makes a new one for the next link.

So maybe now it becomes:

- **Source MAC:** router1's outgoing interface MAC
- **Destination MAC:** router2's MAC

But the IP packet inside is still mostly:

- **Source IP:** A
- **Destination IP:** E

Then router2 gets it, unwraps the frame, checks the destination IP, looks in its routing table, builds a new frame again, and sends it onward.

So the internet trip is basically:

- packet keeps its destination IP as E the whole way
- but at every hop, the frame gets rebuilt with new MAC addresses for that specific local link

So yeah:

router to router to router to router,  
and each time the **MAC addresses flip for the next immediate hop**,  
not for the final computer across the world.

###### Super low level version
Lets say:

- A wants to send to E
- A's gateway is home router R1
- then ISP router R2
- then another router R3
- then finally E's local router R4
- then E

What happens is kinda like this:

**Step 1: A to home router**
- packet says destination IP = E
- frame says destination MAC = R1

**Step 2: R1 to ISP router**
- R1 removes A's frame
- keeps the IP packet
- makes a new frame
- destination MAC = R2

**Step 3: R2 to R3**
- R2 removes old frame
- makes new frame
- destination MAC = R3

**Step 4: R3 to R4**
- same thing again

**Step 5: R4 to E**
- now R4 is finally on E's local network
- R4 ARPs for E's MAC if needed
- then sends frame directly to E's MAC

So when the data finally reaches E:

- the **IP destination** has been E the whole time
- the **MAC destination** has changed at every hop


###### note:
- the router does not just edit the old frame and forward it forever
- it removes the old layer 2 frame
- then creates a fresh new layer 2 frame for the next link

That is why MAC addresses are a **local delivery system**, not a global internet delivery system.

##### DNS, how tf does computers get the destination IP in the first plaee??
    

WAP ( Wireless Access Point )


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

 
