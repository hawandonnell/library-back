const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const helmet = require("helmet");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Get all books and authors
app.get("/authors", async (req, res) => {
	const authors = await prisma.author.findMany({
		include: { books: true },
	});
	res.json(authors);
});

app.get("/books", async (req, res) => {
	const books = await prisma.book.findMany({
		include: { author: true },
	});
	res.json(books);
});

// Delete books and authors by id
app.delete("/author/:id", async (req, res) => {
	const { id } = req.params;
	const result = await prisma.author.delete({
		where: {
			id: Number(id),
		},
	});
	res.json(result);
});

app.delete("/book/:id", async (req, res) => {
	const { id } = req.params;
	const result = await prisma.book.delete({
		where: {
			id: Number(id),
		},
	});
	res.json(result);
});

// Get author or book by id
app.get("/author/:id", async (req, res) => {
	const { id } = req.params;
	const result = await prisma.author.findUnique({
		where: {
			id: Number(id),
		},
	});
	res.json(result);
});

app.get("/book/:id", async (req, res) => {
	const { id } = req.params;
	const result = await prisma.book.findUnique({
		where: {
			id: Number(id),
		},
	});
	res.json(result);
});

// Update book or author

app.put("/book/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const { title, publishedAt, authorId } = req.body;
		const book = await prisma.book.update({
			where: {
				id: Number(id),
			},
			data: {
				title,
				publishedAt,
				authorId,
			},
		});
		res.json(book);
	} catch (e) {
		res.json({ error: e });
	}
});

// Route to update author data - firstName, lastName, birthAt, update books (add from already existing)
app.put("/author/:id", async (req, res) => {
	const { id } = req.params;
	const { firstName, lastName, birthAt } = req.body;

	const result = await prisma.author.update({
		where: {
			id: Number(id),
		},
		data: {
			firstName,
			lastName,
			birthAt,
		},
	});
	res.json(result);
});

// Routes to create books, authors

app.post("/author", async (req, res) => {
	const { firstName, lastName, birthAt } = req.body;
	const author = await prisma.author.create({
		data: {
			firstName,
			lastName,
			birthAt,
		},
	});
	res.json(author);
});

app.post("/book", async (req, res) => {
	const { title, publishedAt, authorId } = req.body;
	const book = await prisma.book.create({
		data: {
			title,
			publishedAt,
			author: {
				connect: {
					id: authorId,
				},
			},
		},
	});
	res.json(book);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
	console.log(`
    Server ready at: http://localhost:5000
    See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api
  `)
);
