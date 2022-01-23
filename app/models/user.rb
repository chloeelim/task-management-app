class User < ApplicationRecord
    has_many :tasks
    has_many :subjects
    has_many :events
    has_secure_password
    
    # validation to prevent invalid, or empty data from being saved to the data base
    # ensure username is non-empty, is unique, and has a minimum length of 3
    validates :username, presence: true
    validates :username, uniqueness: true
    validates :username, length: { minimum: 3 }
    # validate username format (alphanumeric, _, .)
    validates_format_of :username, :with => /\A[A-Za-z0-9_.]+\z/i
end
