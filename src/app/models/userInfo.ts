export class UserInfoModel
{
	user_name: string;
	
	user_type: string;

	token: string;

	constructor(obj: any = null)
	{
		if(obj != null)
		{
			Object.assign(this, obj);
		}
	}
}