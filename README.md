## What it is
This is sample application, that checks Collatz conjecture by brute-force. It take random start number in range 2^96 - 2^97, and checks, how many steps by Collats rules it takes to reach number 1.

Then application tries next 1000 consecutive numbers. The more step is required to reach 1, the better started number is considered.

Best found starting numbers are displayed in application log. But, only started number better than all before showing in log.

If application will found starting number that have infinite steps - application will check only the first 10k steps, and write in log "epic win! Number is found"

Also, application runs "benchmark" on it's own start. Look at something like "calculation speed: 532500 tries per second"

By design, application will run in "nice" mode, i.e. it will use CPU gently, in low priority. But in other hand, it will provide 100% CPU load, so it can be bad for cooling system.

If you start application by docker-compose - it will automatically restart. It will happen because setting "restart: unless-stopped" in docker-compose.yml. Change it by our own, if you want other behavior.

This application created as example, how easy to use long math and multiprocessing on node.js.

## How to run
Just start it by Docker-compose:
docker compose up -d

Or start it directly by using docker

## Variables
* USE_THREADS:
  * "all" = use same count of threads as CPU cores in system
  * any number = use choosen amount of cores

## Best found starting numbers:

| starting number | num of steps |
| :---: | :---: |
| 110043195266756993407079253487n | 2007 |
| 132842840667720374793847262364n | 2015 |
| 135680417359315317517890004761n | 2028 |
| 115544729880618903726062827506n | 2033 |
| 91259525179551006638948346153n | 2061 |
| 119518449259173802999399250785n | 2064 |
| 136010784355704026830829989435n | 2072 |
| 123332218522593200187944541345n | 2095 |
|  99585072773988590640962788235n | 2105 |
| 135601843076361271881108089340n | 2134 |
| 116136808530187368936497070076n | 2144 |
| 144559898619483001139404108988n | 2147 |
| 127842169576440745655274268894n | 2152 |
| 152279976289605783227157662107n | 2191 |
| 104496519615652216669078815554n | 2206 |
|  93894303919762902633244593695n | 2229 |
| 102211931259749359959202342206n | 2299 |

## Docker log sample:
![image](https://github.com/user-attachments/assets/1ab901d8-8a1c-4cd6-a42f-a64d8d0545d2)


