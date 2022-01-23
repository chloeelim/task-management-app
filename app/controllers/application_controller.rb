class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token
    helper_method :login!, :logged_in?, :curr_user, :authorized_user?, :logout!

    def index
    end
    
    # ! at the end tells ruby this is a dangerous method so it throws an exception if it fails
    def login!
        # puts "user: #{@user}, user id: #{@user.id}"
        session[:user_id] = @user.id
    end

    def logged_in?
        # the double-bang operator converts a value to boolean
        !!session[:user_id]
        # puts "#{!!session[:user_id]}"
    end

    def curr_user
        # conditional assignment operator
        @curr_user ||= User.find(session[:user_id]) if session[:user_id]
        # puts "session id: #{session[:user_id]}"
        # puts "user: #{User.find(session[:user_id])}"
        # puts "curr user: #{@curr_user}"
    end

    def authorized_user?
        @user == curr_user
     end
     
    def logout!
        session.clear
     end
end