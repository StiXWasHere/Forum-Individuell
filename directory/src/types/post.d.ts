type ThreadCategory = "THREAD" | "QNA";

type User = {
	userName: string;
  	userId: string;
	password: string;
}

interface Thread {
	id: string;
	category: ThreadCategory;
	title: string;
	description: string;
	creationDate: Date;
	creator?: User; //ändra från optional
	comments?: ThreadComment[];
}

type QNAThread =  Thread & { //Type extension
	category: "QNA";
	isAnswered: boolean;
	commentAnswerId?: number;
}

type ThreadComment = {
	id: User; //kan skapa buggar
	thread: Thread;
	content: string;
	creator: "GUEST"; //ändra
}

type SubmitForm = {
	title:string,
	description:string
}

type ErrorForm = SubmitForm & {
	selection:string
}
