# UI Behaviour Assumptions

The brief allows us to make UI behaviour assumptions where the requirements are open. These are the ones this implementation makes.

## Searching

1. **Either field can be used on its own.**
   - **City only:** shows OpenWeather's best match for that city name.
   - **City and country:** shows that city within that country.
   - **Country only:** shows country-level weather (for example, "Indonesia, ID"),
     matching the sample mockup's single "Country" field.
   - **Both empty:** shows "Please enter a city or country name."
2. **Country accepts a name or an ISO 3166 code**, in any letter case: "Malaysia",
   "malaysia", "MY" and "my" all work. A few common informal names also work, such
   as "USA", "UK" and "Korea".
3. **An unrecognised country is caught before any API call.** The user sees
   `"Atlantis" is not a recognised country.` This saves a request and gives a more
   specific message than "Not found".
4. **A city that exists but isn't in the requested country counts as "Not found".**
   OpenWeather sometimes ignores an unmatched country and returns a city from
   elsewhere, so the app checks the country of the result itself.
5. **The search runs from the Search button or the Enter key.** If a new search
   starts while one is still loading, the older request is cancelled.
6. **Temperatures are in °C**, rounded to whole degrees. "H" and "L" are OpenWeather's
   current max/min temperatures for the area.
7. **The time shown is when the user made the search**, in their local time zone,
   formatted like the mockup (`01-09-2022 09:41am`).

## Results and errors

8. **On error, the previous result is hidden** and only the message is shown,
   matching the "Not found" mockup. The history stays visible.
9. **Error messages are specific to the cause**: empty city, unknown country, city not
   found, invalid or missing API key, rate limit, or network failure.
10. **The weather illustration uses the provided assets.** The sun-and-cloud image is
    for Clear and Clouds, as in the mockup. The rain cloud is for every other
    condition (Rain, Drizzle, Thunderstorm, Snow, Mist and so on). The mapping lives in
    `src/utils/weatherIllustration.ts`, so new artwork is easy to add.

## Clear button

11. **Clear empties both inputs and dismisses any error message.** It does not remove
    the weather currently shown or the history, because those have their own
    controls.

## Search history

12. **Only successful searches are added to the history.** Failed searches are not
    recorded.
13. **The newest search is listed first.**
14. **No duplicates.** Searching for a place that is already in the history moves it
    to the top and updates its time. Re-searching from the history does the same.
15. **The history is saved in `localStorage`**, so it survives page reloads. It is kept
    to the 20 most recent places.
16. **Delete removes one entry right away**, with no confirmation, because an entry is
    cheap to recreate. When the list is empty, "No Record" is shown.
17. **Place names use the API's spelling** ("johor" is saved as "Johor"), so the
    history looks tidy and re-searches reliably.

## Theme and layout

18. **Both the light and dark themes are built**, with a switcher (the optional
    requirement). The first visit follows the operating system's preference. After
    that, the user's choice is remembered.
19. **The layout is mobile-first.** Below 640px it follows the mobile mockup: details
    in two columns, and each history row shows the time under the place. From 640px
    up it follows the desktop mockup.
