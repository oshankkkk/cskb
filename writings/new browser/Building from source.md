My PC with despite having 16gigs of RAM couldnt compile zen from source with its default build config. There where some rust parallel process happening at a point where the jobs where consuming a shit ton of RAM that my pc crashes. After a bit of struggling i found out bout swap files and it worked.
#### Swap files in linux
Swap files are basically letting your OS use your storage space as extra space for the actual memory, like it lets the work overflow into the disk yk as your actual RAM gets filled with what your currently doing the other stuff thats getting cramped are overflown to the disk. But since SSDs are really slow compared to actual RAM, whatever process your doing is gonna get 10x slower. Its still better than crashing tho.
Mine took 2 hours compile.

```
RAM (16 GB) + Swap (16 GB) = 23 GB total available memory
```
#### How to make a swap file in linux

``` txt
# Create a file of the desired size
sudo fallocate -l 4G /swapfile

# Restrict access (security)
sudo chmod 600 /swapfile

# Put a swap header on it
sudo mkswap /swapfile

# Tell the kernel to use it
sudo swapon /swapfile
```

These didnt work for me tho cause i use fedora and it has a different filesystem something. So i used this and it worked.

```
# Create a btrfs subvolume for swap (required on btrfs)
sudo btrfs subvolume create /swap

# Create the swapfile with the correct btrfs flags
sudo btrfs filesystem mkswapfile --size 16g /swap/swapfile

# Activate it
sudo swapon /swap/swapfile

# Swap file data
free -h
# Show active swap files
swapon
```

> ill find and explain bout that different filesystem thing later

#### How they work

After you run a the cmd that says "allocate this much memory into this file" you have to run  `mkswap`

>btw you can name the swapfile anything you want, the mkswap cmd is what turns it into a actual swap file

```text
# Create a file of the desired size
sudo fallocate -l 4G /swapfile

/swapfile
+----------------+
| 0 0 0 0 0 0 0  |
| 0 0 0 0 0 0 0  |
|     empty      |
+----------------+
```

```text
# Put a swap header on it
sudo mkswap /swapfile

/swapfile
+----------------+
| swap metadata  |  <-- header/signature
+----------------+
|                |
|    free space  |
|                |
+----------------+
```

It writes a small header with meta data like a unique id, version info, size, etc. The rest is just a region where the kernel can store memory pages.

> Whats memory PAGES? ( a fancy way of saying data?)
#### How the kernel uses the swap file

```text
Bellow RAM is full
+----------------+
| Firefox page A |
| Game textures  |
| Old terminal   |
| Vim buffers    |
+----------------+

The OS sees that the old terminal (not used in longtime), moves it into the swap file. 
It takes that memory page (usually 4 KB) and writes it into the swap file.

swapfile
+----------------+
| metadata       |
+----------------+
| page 321       | <- old terminal data
| page 322       |
+----------------+

RAM has space now
+----------------+
| Firefox page A |
| Game textures  |
|     FREE       |
+----------------+
```

> What is a memory page

The kernel maintains page tables.

```text
Virtual address in RAM
       |
       v
Physical RAM address
```

For a swapped files its: 

```text
Virtual address
       |
       v
Swap entry:
    swapfile offset 0x1234000
```
 
 When the CPU accesses that virtual address, the MMU sees that the page is not in RAM and triggers a page fault. The kernel finds the page in the swap file, reads the page back into RAM updates the page table and resumes the program.

> Whats the MMU?

