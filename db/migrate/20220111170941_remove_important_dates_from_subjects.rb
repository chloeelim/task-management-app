class RemoveImportantDatesFromSubjects < ActiveRecord::Migration[6.0]
  def change
    remove_column :subjects, :important_dates
  end
end
