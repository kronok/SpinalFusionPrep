// products.ts
export interface Product {
  id: string
  name: string
  description: string
  categories: string[]
  image: string       // placeholder image filename (located in public/images)
  link: string        // Amazon product link
}

export const products: Product[] = [
/*  {
    id: "dummy",
    name: "Fake Product",
    description: "A raised seat reduces the need to bend, making it easier to sit down and stand up from the toilet after surgery. The attached handles provide extra support and stability during bathroom transfers.",
    categories: ["Bathroom", "Bedroom", "Clothing", "Mobility", "Sleep", "Vitamins", "Miscellaneous"],
    image: "raised_toilet_seat.jpg",
    link: "https://amzn.to/4hZs8zN"
  },*/
  {
    id: "toilet_safety_rail",
    name: "Toilet Safety Rail",
    description: "Incredibly important to help ease yourself on and off the toilet. I couldn't live without this for at least 2 months.",
    categories: ["Bathroom", "Mobility"],
    image: "toilet_safety_rail.jpg",
    link: "https://amzn.to/43QfcXt"
  }
  ,
  {
    id: "bedside_table_on_wheels",
    name: "Bedside Table on Wheels",
    description: "Useful to slide in/out from under your bed to help you eat or prop a tablet on top of. Some sort of rolling table is useful in general.",
    categories: ["Bedroom", "Miscellaneous"],
    image: "bedside_table_on_wheels.jpg",
    link: "https://amzn.to/3LFMFxm"
  }
  ,
  {
    id: "satin_sheets",
    name: "Satin Sheets",
    description: "You'll find it incredibly difficult to shift yourself around on a normal sheet. Satin sheets makes it more like a slip and slide. I tried going back to the old sheets and could barely move.",
    categories: ["Bedroom", "Sleep"],
    image: "satin_sheets.jpg",
    link: "https://amzn.to/443Ubbx"
  }
  ,
  {
    id: "gel_ice_pack",
    name: "Gel Ice Pack",
    description: "If your surgeon recommends it, ice packs can be helpful with swelling and to provide some pain relief. I personally didn't use these much because I didn't like the cold feeling, but I know others who loved them.",
    categories: ["Miscellaneous"],
    image: "gel_ice_pack.jpg",
    link: "https://amzn.to/4i1hGYD"
  }
  ,
  {
    id: "calcium_supplements",
    name: "Calcium Supplements",
    description: "Calcium is one of the more important nutrients to get while recovering from spinal fusion. The Vitamin D3/K2 is helpful for absorption.",
    categories: ["Vitamins"],
    image: "calcium_supplements.jpg",
    link: "https://amzn.to/4nNZD9z"
  }
  ,
  {
    id: "shower_grab_bars",
    name: "Shower Grab Bars",
    description: "Depending on your shower setup, this can be useful to get in/out of the shower and to also have some sort of support to either get up from your shower chair or just have a place to grab if you're not feeling confident.",
    categories: ["Bathroom", "Mobility"],
    image: "shower_grab_bars.jpg",
    link: "https://amzn.to/4qZ4WpF"
  }
  ,
  {
    id: "shower_chair",
    name: "Shower Chair",
    description: "Showering is one of the scarier things to do in your first couple of weeks. Everything takes a longer time, so it's nice to sit while you spray down.",
    categories: ["Bathroom", "Mobility"],
    image: "shower_chair.jpg",
    link: "https://amzn.to/4r0UUUM"
  }
  ,
  {
    id: "long_reach_grabber",
    name: "Long Reach Grabber",
    description: "Whoever is taking care of you is going to get real tired of you asking, \"can you get that for me?\" after the two weeks. The hospital may give you one of these to take home, but having multiple in the house in different areas is useful.",
    categories: ["Miscellaneous", "Mobility"],
    image: "long_reach_grabber.jpg",
    link: "https://amzn.to/3XvuUn0"
  }
  ,
  {
    id: "shoe_horn",
    name: "Shoe Horn",
    description: "The greatest invention known to man to help you get your shoes on. Even with someone trying to help you get your shoes on, the shoe horn does a better job. The hospital might provide you with one of these.",
    categories: ["Miscellaneous", "Mobility"],
    image: "shoe_horn.jpg",
    link: "https://amzn.to/4hVWCCM"
  }
  ,
  {
    id: "laundry_sanitizer",
    name: "Laundry Sanitizer",
    description: "The risk of infection is scary, so getting a sanitizer for your laundry isn't a bad idea. Especially if you have pets.",
    categories: ["Clothing", "Miscellaneous"],
    image: "laundry_sanitizer.jpg",
    link: "https://amzn.to/4nSem3h"
  }
  ,
  {
    id: "protein_powder",
    name: "Protein Powder",
    description: "Surgeons recommend a lot of protein to help with healing. It was a noticable improvement when I included this in smoothies.",
    categories: ["Miscellaneous", "Vitamins"],
    image: "protein_powder.jpg",
    link: "https://amzn.to/4r1Cof7"
  }
  ,
  {
    id: "handheld_shower_head",
    name: "Handheld Shower Head",
    description: "You'll find it quite difficult to shower in the first two weeks without this. A handheld shower head is extra useful so you can sit in a shower chair and avoid getting your back wet.",
    categories: ["Bathroom"],
    image: "handheld_shower_head.jpg",
    link: "https://amzn.to/4pbBUkX"
  }
  ,
  {
    id: "bidet_attachment_for_toilet",
    name: "Bidet Attachment for Toilet",
    description: "If you buy a single item, get this. Wiping your butt isn't easy, and having a bidet turns what would be a long difficult process into nearly a single wipe. I'd recommend this even if you're not having surgery. Cheap, saves toilet paper, and pretty easy to install.",
    categories: ["Bathroom"],
    image: "bidet_attachment_for_toilet.jpg",
    link: "https://amzn.to/4nXRbVk"
  }
  ,
  {
    id: "sock_aid",
    name: "Sock Aid",
    description: "The hospital may provide you with one of these, but in my experience it was way too big for regular socks. I relied on someone to put socks on for me for awhile, but if I were to do it over again I would get one of these for regular socks..",
    categories: ["Clothing", "Mobility"],
    image: "sock_aid.jpg",
    link: "https://amzn.to/4nZWuUi"
  }
  ,
  {
    id: "walker_with_wheels",
    name: "Walker with Wheels",
    description: "You'll rely on this to feel somewhat confident doing anything in those first two weeks. The hospital didn't provide me with one, so I needed to get my own.",
    categories: ["Mobility"],
    image: "walker_with_wheels.jpg",
    link: "https://amzn.to/3K5aRJ3"
  }
  ,
  {
    id: "walking_cane",
    name: "Walking Cane",
    description: "I personally never got one of these, but there was a period between needing a walker and free-walking that I would have felt more confident with one of these. If you get one walking aid, though, get a walker.",
    categories: ["Mobility"],
    image: "walking_cane.jpg",
    link: "https://amzn.to/4oK3ciy"
  }
  ,
  {
    id: "electric_lift_recliner",
    name: "Electric Lift Recliner",
    description: "Some can sleep in their bed, but even though I had a comfortable bed that was also adjustable, I couldn't get in/out of the bed without extreme pain. I fully relied on a recliner with an electric lift for months because it was the only place I felt comfortable. Before you go buying a recliner, definitely go to your local Medical Supply Store and see if you can rent one.",
    categories: ["Miscellaneous", "Sleep"],
    image: "electric_lift_recliner.jpg",
    link: "https://amzn.to/4i4bY8v"
  }
  ,
  {
    id: "button_up_loose_sleepwear",
    name: "Button Up Loose Sleepwear",
    description: "Front buttons and very loose clothing is recommended for comfort. This product is just an example, use anything you'd like.",
    categories: ["Clothing", "Sleep"],
    image: "button_up_loose_sleepwear.jpg",
    link: "https://amzn.to/3LGMCkT"
  }
]
