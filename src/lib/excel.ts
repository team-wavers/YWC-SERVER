import { Store } from 'src/models/store.model';
import xlsx from 'xlsx';

export const excelToMysql = async (file: string) => {
	const workbook = xlsx.readFile(file);
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];
	const rows:any = xlsx.utils.sheet_to_json(worksheet);

	for (const row of rows) {
		const newStore = {
			name: row.가맹점명,
			number: row.가맹점번호,
			category: row.업종명.split(' ').join(''),
			phone: row.전화번호.split('-').join(''),
			address: row.주소,
		}
		const store = new Store(newStore);
		await store.save();
	}
};
