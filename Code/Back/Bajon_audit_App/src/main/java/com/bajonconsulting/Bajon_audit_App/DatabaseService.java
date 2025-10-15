package com.bajonconsulting.Bajon_audit_App;

import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DatabaseService {

    /**
     * Exemple de requête SELECT
     */
    public List<String> getTable(String tableName) {
        List<String> results = new ArrayList<>();
        String sql = "SELECT * FROM " + tableName;
        
        try (Connection connection = DatabasePool.getConnection();
            PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                // Exemple : récupérer la première colonne
                results.add(resultSet.getString(1) + " " + resultSet.getString(2) + " " + resultSet.getString(3));
            }
            statement.close();
        } catch (SQLException e) {
            System.err.println("Erreur lors de l'exécution de la requête : " + e.getMessage());
            e.printStackTrace();
        }
        
        return results;
    }

    public boolean insertData(String tableName, String columnName, String value) {
        String sql = "INSERT INTO " + tableName + " (" + columnName + ") VALUES (?)";
        
        try (Connection connection = DatabasePool.getConnection();
            PreparedStatement statement = connection.prepareStatement(sql)) {
            
            statement.setString(1, value);
            int rowsAffected = statement.executeUpdate();
            
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            System.err.println("Erreur lors de l'insertion : " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateData(String tableName, String columnName, String newValue, int id) {
        String sql = "UPDATE " + tableName + " SET " + columnName + " = ? WHERE id = ?";
        
        try (Connection connection = DatabasePool.getConnection();
            PreparedStatement statement = connection.prepareStatement(sql)) {
            
            statement.setString(1, newValue);
            statement.setInt(2, id);
            int rowsAffected = statement.executeUpdate();
            
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            System.err.println("Erreur lors de la mise à jour : " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteData(String tableName, int id) {
        String sql = "DELETE FROM " + tableName + " WHERE id = ?";
        
        try (Connection connection = DatabasePool.getConnection();
            PreparedStatement statement = connection.prepareStatement(sql)) {
            
            statement.setInt(1, id);
            int rowsAffected = statement.executeUpdate();
            
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            System.err.println("Erreur lors de la suppression : " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean testConnection() {
        try (Connection connection = DatabasePool.getConnection()) {
            return connection != null && !connection.isClosed();
        } catch (SQLException e) {
            System.err.println("Erreur de connexion : " + e.getMessage());
            return false;
        }
    }
}
