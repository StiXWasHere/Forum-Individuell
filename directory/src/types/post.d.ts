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
	creator: User; 
	comments?: ThreadComment[];
	status: boolean;
}

type QNAThread =  Thread & { //Type extension
	category: "QNA";
	isAnswered: boolean;
	commentAnswerId?: number;
}

type ThreadComment = {
	id: string;
	thread: Thread;
	content: string;
	creator: User; 
	isAnswer?: boolean;
}

type SubmitForm = {
	title:string,
	description:string
}

type ErrorForm = SubmitForm & {
	selection:string
}
