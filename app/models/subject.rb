class Subject < ApplicationRecord
    belongs_to :user
    has_many :tasks, dependent: :nullify
    has_many :events, dependent: :nullify

    validates :title, presence: true
    # checks color is a valid format
    validates_format_of :color, :with => /\A#?(?:[A-F0-9]{3}){1,2}\z/i
end
