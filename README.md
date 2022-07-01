## Loop Strategy Riddle

### Based on Varitasium's Youtube video [The Riddle That Seems Impossible Even If You Know The Answer](https://www.youtube.com/watch?v=iSNsgj1OCLA)

Best explanation is to watch the video above...
TLDR:
36 prisoners search 36 boxes for a ticket (pink number)
Every prisoner gets to look in 18 boxs (36 / 2)
If all prisoners find their ticket, they all go free.
If any prisoners runs out of turns, they all lose.
Chance of success with random guessing = (1/2)^36
which is.... 0.0000000015% 🎲
Chance of success with loop strategy = 1 - (1/19 + 1/20 + ... + 1/36)
which is.... ~32% 🤯🤯🤯

#### getting started:

`npm install` before doing anything else.

This project uses [parcel](https://parceljs.org/) to build and run a development server.

#### development:

`npm run start` to start the developer server at `http://localhost:1234`

#### build:

`npm run build` will build the project to `/dist`
