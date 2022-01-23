class SessionsController < ApplicationController
    def create
        # create a session (when user logins)
        @user = User.find_by(username: session_params[:username])
        # if user exists, and authentication is successful (&. is Ruby's safe navigation operator, prevents nil errors)
        if @user&.authenticate(session_params[:password])
            # helper method login! in application_controller
            login!
            render json: { 
                logged_in: true,
                user: @user 
            }
        else
            render json: {
                status: 401,
                errors: ["Invalid username/ wrong password.", "Please try again, or create an account if you don't have one."]
            }
        end
    end

    def is_logged_in?
        if logged_in? && curr_user
            render json: {
                logged_in: true,
                user: curr_user
            }
        else
            render json: {
                logged_in: false,
                message: "No such user"
            }
        end
    end

    def destroy
        logout!
        render json: {
            status: 200,
            logged_out: false
        }
    end

    private
    def session_params
        params.require(:user).permit(:username, :password)
    end

end