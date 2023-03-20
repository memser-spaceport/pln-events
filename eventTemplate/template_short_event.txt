---
eventName: "<Your_Event_Name>" #the name of your track or event and its mandatory

eventDescription: "<Short_Description_of_your_event>" #short description of your track or event limiting to 100-150 characters

#topics will show up as labels on the event card.Only a maximum of 4 tags will be displayed on the event card. Some referneces for topics - Blockchain, Web3, Cryptocurrency, Tech Taks,Workshop etc.

eventTopic: 
  - "<Topic_1>"
  - "<Topic_2>"
  - "<Topic_3>"
  - "<Topic_4>" 

eventType: "Conference" or "Virtual" or "Social" #Type of the event: Please choose one among the below options or just leave it blank

location: "City, Country" or "Location TBD" #Specify the location of the event.If you aren't sure about the location then mention "Location TBD"

venueName: "<Your_Venue_Name>" #the event venue name (will show up on the event card) or just leave it blank

venueAddress: "<Your_Venue_Address>" #the event venue address (will show up on a map) or just leave it blank

venueMapsLink: "<Google_Map_link_for_the_venue>" #the event venue Map link (will show up on a map) or just leave it blank

website: "<your_website_url>" #make sure to have all the relevant information: dates, venue, program, ticketing (if any), etc. or just leave it blank

startDate: "<MM/DD/YYYY>" # the start date of the event , date format is MM/DD/YYYY eg: if it is February 16th 2023 => 02/16/2023

endDate: "<MM/DD/YYYY>" #the end date of the event , date format is MM/DD/YYYY eg: if it is February 18th 2023 => 02/18/2023

tag: "PLN Event" or "Industry Event" #Mention any one of the event types. Don't leave it blank.

dateTBD: false or true #If you don't have concrete dates, add the approximate dates & set dateTBD: true.

#Preferred social means of contacts-this is a placeholder for social handle like Twitter, Discord and so on and not to be mistaken for email contacts for eg.   - 'twitter|https://twitter.com/IPFS/status/1629199396700098560?s=20'

preferredContacts:
  - '<contact_means>|<contact_url>'

#Event host names and their respective logos-place the logo file on the path 'public/uploads' for eg.   - IPFS|ipfs-logo.png

eventHosts:
  - <host_name>|<host_logo>
---