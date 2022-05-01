const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authorData = [
	{
		firstName: "William",
		lastName: "Shakespeare",
		birthAt: 1564,
		books: {
			create: [
				{
					title: "Hamlet",
					publishedAt: 1602,
				},
				{
					title: "Romeo and Juliet",
					publishedAt: 1597,
				},
			],
		},
	},
	{
		firstName: "Joanne",
		lastName: "Rowling",
		birthAt: 1965,
		books: {
			create: [
				{
					title: "Harry Potter and the Philosopher's Stone",
					publishedAt: 1997,
				},
				{
					title: "Fantastic Beasts and Where to Find Them",
					publishedAt: 2001,
				},
			],
		},
	},
];

async function main() {
	console.log(`Start seeding ...`);
	for (const u of authorData) {
		const author = await prisma.author.create({
			data: u,
		});
		console.log(`Created author with id: ${author.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
