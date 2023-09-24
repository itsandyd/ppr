const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.CourseCategory.createMany({
            data: [
                { name: "Ableton" },
                { name: "FL Studio" },
                { name: "Mixing" },
                { name: "Mastering" },
                { name: "Music Theory" },
                { name: "Synthesis" },
                { name: "Sound Design" },
                { name: "Drum Programming" },
                { name: "Vocal Production" },
            ]
        });
    
        console.log("Success");
      } catch (error) {
        console.log("Error seeding the database categories", error);
      } finally {
        await database.$disconnect();
      }
    }
    
    main();