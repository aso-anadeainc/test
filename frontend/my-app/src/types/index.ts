export interface FormErrors {
	[key: string]: string;
}


export interface Movie {
	id: number;
	title: string;
	publishingYear: number;
	image: string;
	description?: string;
	userId: number;
}

export interface LayoutProps {
	children: React.ReactNode;
	pageTitle?: React.ReactNode | string;
}
