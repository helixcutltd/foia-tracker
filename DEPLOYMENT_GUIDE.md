# FOIA Tracker - Local Deployment Guide (For Mac)

This guide will walk you through setting up the FOIA Tracker application on your Mac, explained in simple terms.

## What You'll Need

1. **PostgreSQL** - A database to store your data
2. **Node.js** - To run the application
3. **A Terminal** - The black window where you type commands

## Step 1: Install PostgreSQL

### The Easy Way - Using Postgres.app

1. Go to https://postgresapp.com/
2. Click the big "Download" button
3. Open the downloaded file and drag Postgres to your Applications folder
4. Open Postgres from your Applications
5. Click "Initialize" to create a new server
6. You'll see an elephant icon in your menu bar - that means it's running!

### Setting Up Your Database Password

1. Click the elephant icon in your menu bar
2. Click "Open psql"
3. Type this command and press Enter:
   ```
   ALTER USER postgres PASSWORD 'yourpassword';
   ```
   (Replace 'yourpassword' with whatever password you want)
4. Type `\q` and press Enter to exit

## Step 2: Install Node.js (if you don't have it)

1. Go to https://nodejs.org/
2. Click the button that says "LTS" (Long Term Support)
3. Download and run the installer
4. Follow the installation steps

To check if it worked, open Terminal and type:
```bash
node --version
```
You should see a version number like `v20.11.0`

## Step 3: Set Up the Application

1. Open Terminal (find it in Applications > Utilities)
2. Navigate to the project folder by typing:
   ```bash
   cd /Users/sid/Desktop/Foiatracker/foia-tracker/foia-tracker
   ```

3. Install all the needed packages:
   ```bash
   npm install
   ```
   (This might take a few minutes)

## Step 4: Configure Your Database

1. In the project folder, find the file called `.env.local`
2. Open it with TextEdit
3. Change this line:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/foia_tracker?schema=public"
   ```
   Replace `password` with the password you set in Step 1

4. Save and close the file

## Step 5: Create Your Database

1. In Terminal, make sure you're still in the project folder
2. Run these commands one by one:

   ```bash
   npx prisma db push
   ```
   This creates all the tables in your database

   ```bash
   npm run db:seed
   ```
   This adds some sample states and counties

## Step 6: Start the Application

1. In Terminal, run:
   ```bash
   npm run dev
   ```

2. You'll see something like:
   ```
   ✓ Ready in 2.1s
   ○ Local: http://localhost:3000
   ```

3. Open your web browser and go to: http://localhost:3000

## How to Use the Application

### Viewing the Map
- The main page shows a map of the United States
- Numbers on states show how many pending FOIA requests there are
- Green states = No pending requests
- Yellow/Orange/Red = Increasing number of pending requests

### Adding a New Case
1. Click "Add Case" in the top navigation
2. Upload a screenshot of the case
3. The app will try to read the text from your screenshot
4. Select which county the case belongs to
5. Click submit

### Managing Cases
1. Click on any state to see its cases
2. You can mark cases as "Applied" when you've submitted the FOIA request
3. Cases marked as applied will turn green and won't count as pending

## Stopping the Application

To stop the application:
1. Go to the Terminal window where it's running
2. Press `Control + C` (hold Control and press C)

## Starting the Application Again Later

1. Make sure PostgreSQL is running (you should see the elephant icon)
2. Open Terminal
3. Navigate to the project:
   ```bash
   cd /Users/sid/Desktop/Foiatracker/foia-tracker/foia-tracker
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser

## Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running (elephant icon in menu bar)
- Check your password in `.env.local` matches your PostgreSQL password

### "Port 3000 is already in use"
- Another application is using that port
- Stop it or run the app on a different port:
  ```bash
  npm run dev -- -p 3001
  ```
  Then go to http://localhost:3001

### Map not showing
- The map needs internet to load the tiles
- Make sure you're connected to the internet

## Tips

- Keep PostgreSQL running whenever you want to use the app
- The database saves all your data even when the app is closed
- Screenshots are saved in the `public/uploads` folder
- You can view the database directly using:
  ```bash
  npm run db:studio
  ```

That's it! You now have your own FOIA tracking system running locally on your Mac.