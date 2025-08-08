const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        console.log('🗑️  Clearing database...');

        // Delete in correct order due to foreign key constraints
        await prisma.task.deleteMany({});
        console.log('✅ Deleted all tasks');

        await prisma.session.deleteMany({});
        console.log('✅ Deleted all sessions');

        await prisma.user.deleteMany({});
        console.log('✅ Deleted all users');

        console.log('🎉 Database cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
