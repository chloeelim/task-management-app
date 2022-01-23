# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.all.each do |user|
    6.times do |i|
        # Subject.create(title: "Subject #{i + 1}", description: "subject #{i + 1} describe this subject here", color: rand(100000..999999).to_s, user_id: user.id)        
        Task.create(title: "Task #{i + 1}", description: 'read this task page', deadline: "#{i + 1} 0#{i + 1} 2022 1#{i + 1}00", subject_id: i + 1, user_id: user.id)
    end
end