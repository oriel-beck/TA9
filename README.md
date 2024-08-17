# Ta9

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build instructions
Run `ng build` to build a production build.

## Staus of work
Complete

## Assumptions
- Removed search bar and `Go` button at the top as it seemed unrelated to the site and had no specifications.
- Added `Cancel` and `Save` buttons to the `create` and `edit` component. Save is disabled until item is edited.
- Updated date field is set whenever the item is edited and saved. Even if no fields was changed (eg. name was changed, then changed back and saved will update the date)
- Removed `Created By` column as there is no way to set or get the creator in the current instructions.
- Made `tag description` an optional field.
- Set name search as `startsWith` with lowercase matching.
- No delete implemented since was not in the specifications.
- When adding a new item, it gets placed into its proper position in the grid, however, the grid view does not navigate to its position.