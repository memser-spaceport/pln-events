{
  "eventName": "<Your_Event_Name>", # The name of your track or event and its mandatory

  "eventDescription": "<Short_Description_of_your_event>", # Short description of your track or event limiting to 100-150 characters

  # Topics will show up as labels on the event card.Only a maximum of 4 topics will be displayed on the event card. Some references for topics are Blockchain, Web3, Cryptocurrency, Tech Talks, Workshop.
  
  "eventTopic": [
    "<Topic_1>",
    "<Topic_2>",
    "<Topic_3>"
  ],
  
  "eventType": "Conference" (or) "eventType": "Virtual" (or) "eventType": "Social", # Type of the event: Please choose one among the below options or just leave it blank

  "location": "City, Country" (or) "location": "Location TBD", # Specify the location of the event. If you aren't sure about the location then mention "Location TBD"

  "venueName": "<Your_Venue_Name>", # The event venue name (will show up on the event card) or just leave it blank

  "venueAddress": "<Your_Venue_Address>", # The event venue address (will show up on a map) or just leave it blank

  "venueMapsLink": "<Google_Map_link_for_the_venue>", # The event venue Map link (will show up on a map) or just leave it blank

  "website": "<your_website_url>", # Make sure to have all the relevant information: dates, venue, program, ticketing (if any), etc. or just leave it blank

  "startDate": "<YYYY-MM-DDTHH:MM:SSZ>", # The start date of the event , for eg: if it is Sep 16th 2024 and 09 30 AM => 2024-09-16T09:30:00.000Z,

  "endDate": "<YYYY-MM-DDTHH:MM:SSZ>", # The end date of the event , for eg: if it is Sep 18th 2024 and 06 00 PM => 2024-09-18T18:00:00.000Z,

  "tag": "PL Event", (or) "tag": "Industry Event", # Mandatory to mention any one of the event types. Don't leave it blank

  "dateTBD": false, (or) "dateTBD": true, # If you have concrete dates set "dateTBD": false, else add approximate dates & set "dateTBD": true

  # Preferred means of contacts - this is a placeholder for email (for eg:  "email|mailto:<email_id>") and other Social handles like Twitter, LinkedIn, Discord, etc. (for eg. "twitter|https://twitter.com/IPFS/status/1629199396700098560?s=20")

  "preferredContacts": [
   "<contact_means1>|<contact_url1>",
	 "<contact_means2>|<contact_url2>",
  ],

  # Event host names and their respective logos (preferred size is 48px width, 48px height and allowed formats are png, jpeg, jpg, svg, and webp). Place the logo file on the path 'public/uploads' for eg. "IPFS|ipfs-logo.png"

  "eventHosts": [
    "<host_name1>|<host_logo1>",
    "<host_name2>|<host_logo2>"
  ],

  # Specify if this event is a featured event or not, if yes specify as "isFeaturedEvent": true else as "isFeaturedEvent": false
  "isFeaturedEvent": false
}
