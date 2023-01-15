import {
	APP_ENV,
	MAIL_FROM_EMAIL,
	MAIL_PROJECT_LINK,
	MAIL_PROJECT_NAME,
} from '../env'

export interface IPasswordEmail {
	fullName: string
	password: string
	email: string
}

export const generatedPasswordEmail = (props: IPasswordEmail) => {
	return `
    <html style="margin: 0; padding: 0; width: 100%">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Welcome to ${MAIL_PROJECT_NAME}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style id="media-query" type="text/css">
            tr {
                font-family: Open Sans, Monsterrat, Google Sans, Roboto,
                    Helvetica, Arial, sans-serif;
            }
        </style>
    </head>

    <body style="margin: 0; padding: 0; width: 100%">
    <table
    border="0"
    cellpadding="0"
    cellspacing="0"
    class="table-width"
    align="center"
    style="width: 100%"
>
    <tbody>
        <tr>
            <td
                class="col-width"
                align="left"
                valign="top"
                style="
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 24px;
                    color: #242525;
                    width: 100%;
                    background-color: #fcfcfc;
                "
            >
                <table
                    style="
                        border-collapse: collapse;
                        width: 90%;
                        margin-left: 5%;
                    "
                >
                    <tbody>
                        <tr>
                            <td valign="top">
                                <div style="margin: 40px 0">
                                    ${
										APP_ENV !== 'production'
											? `
                                                This is a testing Email
                                                <br /><br />
                                            `
											: ''
									} 
                                    Dear ${props.fullName},
                                    <br />
                                    <br />
                                    You have been given access to <a href="${MAIL_PROJECT_LINK}">${MAIL_PROJECT_NAME}</a>.You may use the following credentials to log in.
                                    <br />
                                    <br />
                                    Credentials:
                                    <br />
                                    <ul>
                                        <li>Email: ${props.email}</li>
                                        <li>Password: ${props.password}</li>
                                    </ul>
                                    <br />
                                    We highly suggest you change your password once you log in, to further secure your access to the ${MAIL_PROJECT_NAME}.
                                    <br />
                                    <br />
                                    <br />
                                    If you encounter any issues while accesing this system, please feel free to contact the us through ${MAIL_FROM_EMAIL}.
                                    <br /><br /><br />
                                    Regards,
                                    <br /><br />
                                    The ${MAIL_PROJECT_NAME} Team
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
    </body>
</html>
    
    `
}
