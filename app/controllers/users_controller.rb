class UsersController < ApplicationController      
      def create
        @user = User.new(user_params)
        if @user.save
          login!
          render json: {
            # return a 201 created status code
            status: :created,
            user: @user
          }
        else 
          render json: {
            status: 500,
            errors: @user.errors.full_messages,
          }
        end
      end

    private
      def user_params
        params.require(:user).permit(:username, :password, :password_confirmation)
      end
    end