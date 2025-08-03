import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// All 50 US states with major counties
const allStatesWithCounties = [
  {
    name: 'Alabama',
    code: 'AL',
    counties: ['Jefferson', 'Mobile', 'Madison', 'Montgomery', 'Tuscaloosa', 'Baldwin']
  },
  {
    name: 'Alaska',
    code: 'AK',
    counties: ['Anchorage', 'Fairbanks North Star', 'Matanuska-Susitna', 'Kenai Peninsula', 'Juneau']
  },
  {
    name: 'Arizona',
    code: 'AZ',
    counties: ['Maricopa', 'Pima', 'Pinal', 'Yavapai', 'Mohave', 'Coconino']
  },
  {
    name: 'Arkansas',
    code: 'AR',
    counties: ['Pulaski', 'Washington', 'Benton', 'Faulkner', 'Sebastian', 'Craighead']
  },
  {
    name: 'California',
    code: 'CA',
    counties: ['Los Angeles', 'San Diego', 'Orange', 'Riverside', 'San Bernardino', 'Santa Clara', 'Alameda', 'Sacramento', 'Contra Costa', 'Fresno']
  },
  {
    name: 'Colorado',
    code: 'CO',
    counties: ['Denver', 'El Paso', 'Jefferson', 'Arapahoe', 'Adams', 'Boulder']
  },
  {
    name: 'Connecticut',
    code: 'CT',
    counties: ['Fairfield', 'Hartford', 'New Haven', 'New London', 'Litchfield', 'Middlesex']
  },
  {
    name: 'Delaware',
    code: 'DE',
    counties: ['New Castle', 'Sussex', 'Kent']
  },
  {
    name: 'Florida',
    code: 'FL',
    counties: ['Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange', 'Pinellas', 'Duval', 'Lee', 'Polk', 'Volusia']
  },
  {
    name: 'Georgia',
    code: 'GA',
    counties: ['Fulton', 'Gwinnett', 'DeKalb', 'Cobb', 'Clayton', 'Cherokee']
  },
  {
    name: 'Hawaii',
    code: 'HI',
    counties: ['Honolulu', 'Hawaii', 'Maui', 'Kauai']
  },
  {
    name: 'Idaho',
    code: 'ID',
    counties: ['Ada', 'Canyon', 'Kootenai', 'Bonneville', 'Twin Falls', 'Bannock']
  },
  {
    name: 'Illinois',
    code: 'IL',
    counties: ['Cook', 'DuPage', 'Lake', 'Will', 'Kane', 'McHenry']
  },
  {
    name: 'Indiana',
    code: 'IN',
    counties: ['Marion', 'Lake', 'Allen', 'Hamilton', 'St. Joseph', 'Vanderburgh']
  },
  {
    name: 'Iowa',
    code: 'IA',
    counties: ['Polk', 'Linn', 'Scott', 'Johnson', 'Black Hawk', 'Woodbury']
  },
  {
    name: 'Kansas',
    code: 'KS',
    counties: ['Johnson', 'Sedgwick', 'Shawnee', 'Wyandotte', 'Douglas', 'Leavenworth']
  },
  {
    name: 'Kentucky',
    code: 'KY',
    counties: ['Jefferson', 'Fayette', 'Kenton', 'Boone', 'Warren', 'Campbell']
  },
  {
    name: 'Louisiana',
    code: 'LA',
    counties: ['Orleans', 'Jefferson', 'East Baton Rouge', 'Caddo', 'Lafayette', 'Calcasieu']
  },
  {
    name: 'Maine',
    code: 'ME',
    counties: ['Cumberland', 'York', 'Penobscot', 'Kennebec', 'Androscoggin', 'Aroostook']
  },
  {
    name: 'Maryland',
    code: 'MD',
    counties: ['Montgomery', 'Prince George\'s', 'Baltimore', 'Anne Arundel', 'Howard', 'Harford']
  },
  {
    name: 'Massachusetts',
    code: 'MA',
    counties: ['Middlesex', 'Worcester', 'Suffolk', 'Norfolk', 'Bristol', 'Plymouth']
  },
  {
    name: 'Michigan',
    code: 'MI',
    counties: ['Wayne', 'Oakland', 'Macomb', 'Kent', 'Genesee', 'Washtenaw']
  },
  {
    name: 'Minnesota',
    code: 'MN',
    counties: ['Hennepin', 'Ramsey', 'Dakota', 'Anoka', 'Washington', 'Wright']
  },
  {
    name: 'Mississippi',
    code: 'MS',
    counties: ['Hinds', 'Harrison', 'DeSoto', 'Jackson', 'Madison', 'Rankin']
  },
  {
    name: 'Missouri',
    code: 'MO',
    counties: ['St. Louis', 'Jackson', 'St. Charles', 'Jefferson', 'Clay', 'Greene']
  },
  {
    name: 'Montana',
    code: 'MT',
    counties: ['Yellowstone', 'Missoula', 'Gallatin', 'Flathead', 'Cascade', 'Lewis and Clark']
  },
  {
    name: 'Nebraska',
    code: 'NE',
    counties: ['Douglas', 'Lancaster', 'Sarpy', 'Hall', 'Buffalo', 'Madison']
  },
  {
    name: 'Nevada',
    code: 'NV',
    counties: ['Clark', 'Washoe', 'Carson City', 'Lyon', 'Elko', 'Douglas']
  },
  {
    name: 'New Hampshire',
    code: 'NH',
    counties: ['Hillsborough', 'Rockingham', 'Merrimack', 'Strafford', 'Cheshire', 'Grafton']
  },
  {
    name: 'New Jersey',
    code: 'NJ',
    counties: ['Bergen', 'Middlesex', 'Essex', 'Hudson', 'Monmouth', 'Ocean']
  },
  {
    name: 'New Mexico',
    code: 'NM',
    counties: ['Bernalillo', 'Dona Ana', 'Santa Fe', 'Sandoval', 'San Juan', 'Valencia']
  },
  {
    name: 'New York',
    code: 'NY',
    counties: ['New York', 'Kings', 'Queens', 'Bronx', 'Suffolk', 'Nassau', 'Westchester', 'Erie', 'Monroe', 'Richmond']
  },
  {
    name: 'North Carolina',
    code: 'NC',
    counties: ['Mecklenburg', 'Wake', 'Guilford', 'Forsyth', 'Cumberland', 'Durham']
  },
  {
    name: 'North Dakota',
    code: 'ND',
    counties: ['Cass', 'Burleigh', 'Grand Forks', 'Ward', 'Williams', 'Stark']
  },
  {
    name: 'Ohio',
    code: 'OH',
    counties: ['Cuyahoga', 'Franklin', 'Hamilton', 'Montgomery', 'Summit', 'Lucas']
  },
  {
    name: 'Oklahoma',
    code: 'OK',
    counties: ['Oklahoma', 'Tulsa', 'Cleveland', 'Comanche', 'Canadian', 'Creek']
  },
  {
    name: 'Oregon',
    code: 'OR',
    counties: ['Multnomah', 'Washington', 'Clackamas', 'Lane', 'Marion', 'Jackson']
  },
  {
    name: 'Pennsylvania',
    code: 'PA',
    counties: ['Philadelphia', 'Allegheny', 'Montgomery', 'Bucks', 'Chester', 'Delaware']
  },
  {
    name: 'Rhode Island',
    code: 'RI',
    counties: ['Providence', 'Kent', 'Washington', 'Newport', 'Bristol']
  },
  {
    name: 'South Carolina',
    code: 'SC',
    counties: ['Greenville', 'Richland', 'Charleston', 'Lexington', 'Spartanburg', 'Horry']
  },
  {
    name: 'South Dakota',
    code: 'SD',
    counties: ['Minnehaha', 'Pennington', 'Lincoln', 'Brown', 'Codington', 'Brookings']
  },
  {
    name: 'Tennessee',
    code: 'TN',
    counties: ['Shelby', 'Davidson', 'Knox', 'Hamilton', 'Rutherford', 'Montgomery']
  },
  {
    name: 'Texas',
    code: 'TX',
    counties: ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis', 'Collin', 'Fort Bend', 'El Paso', 'Denton', 'Williamson']
  },
  {
    name: 'Utah',
    code: 'UT',
    counties: ['Salt Lake', 'Utah', 'Davis', 'Weber', 'Washington', 'Cache']
  },
  {
    name: 'Vermont',
    code: 'VT',
    counties: ['Chittenden', 'Rutland', 'Washington', 'Windsor', 'Addison', 'Franklin']
  },
  {
    name: 'Virginia',
    code: 'VA',
    counties: ['Fairfax', 'Virginia Beach', 'Prince William', 'Chesterfield', 'Henrico', 'Loudoun']
  },
  {
    name: 'Washington',
    code: 'WA',
    counties: ['King', 'Pierce', 'Snohomish', 'Spokane', 'Clark', 'Thurston']
  },
  {
    name: 'West Virginia',
    code: 'WV',
    counties: ['Kanawha', 'Berkeley', 'Cabell', 'Wood', 'Monongalia', 'Jefferson']
  },
  {
    name: 'Wisconsin',
    code: 'WI',
    counties: ['Milwaukee', 'Dane', 'Waukesha', 'Brown', 'Racine', 'Outagamie']
  },
  {
    name: 'Wyoming',
    code: 'WY',
    counties: ['Laramie', 'Natrona', 'Campbell', 'Sweetwater', 'Fremont', 'Albany']
  }
]

async function main() {
  console.log('Seeding database with all US states and counties...')

  // Clear existing data
  await prisma.case.deleteMany()
  await prisma.county.deleteMany()
  await prisma.state.deleteMany()

  // Seed all states and counties
  for (const stateData of allStatesWithCounties) {
    console.log(`Adding ${stateData.name}...`)
    
    const state = await prisma.state.create({
      data: {
        name: stateData.name,
        code: stateData.code,
      }
    })

    for (const countyName of stateData.counties) {
      await prisma.county.create({
        data: {
          name: countyName,
          stateId: state.id
        }
      })
    }
  }

  console.log('Database seeded successfully with all 50 states and major counties!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })