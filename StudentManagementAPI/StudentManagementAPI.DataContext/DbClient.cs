using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static StudentManagementAPI.DataContext.Enums;

namespace StudentManagementAPI.DataContext
{
    public class DbClient
    {
        public static async Task<object> ExecuteProcedureWithQuery(string query, Collection<DbParameters> parameters, ExecuteType executeType)
        {
            string connectionString = AppSettings.GetConnectionString();
            object returnValue;

            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                sqlConnection.Open();

                SqlCommand sqlCommand = new SqlCommand(query, sqlConnection);
                sqlCommand.CommandType = System.Data.CommandType.Text;
                if (parameters != null)
                {
                    AddParameters(ref sqlCommand, parameters);
                }
                if (executeType == ExecuteType.ExecuteNonQuery)
                {
                    returnValue = await sqlCommand.ExecuteNonQueryAsync();
                }
                else if (executeType == ExecuteType.ExecuteScalar)
                {
                    returnValue = await sqlCommand.ExecuteScalarAsync();
                }
                else if (executeType == ExecuteType.ExecuteReader)
                {
                    returnValue = await sqlCommand.ExecuteReaderAsync();
                }
                else
                {
                    returnValue = "";
                }

            }
            return returnValue;
        }

        public static async Task<object> ExecuteProcedure(string ProcedureName, Collection<DbParameters> parameters, ExecuteType executeType)
        {
            string connectionString = AppSettings.GetConnectionString();
            object returnValue;

            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                sqlConnection.Open();

                SqlCommand sqlCommand = new SqlCommand(ProcedureName, sqlConnection);
                sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;

                if (parameters != null)
                {
                    AddParameters(ref sqlCommand, parameters);
                }
                if (executeType == ExecuteType.ExecuteNonQuery)
                {
                    returnValue = await sqlCommand.ExecuteReaderAsync();
                }
                else if (executeType == ExecuteType.ExecuteScalar)
                {
                    returnValue = await sqlCommand.ExecuteScalarAsync();
                }
                else if (executeType == ExecuteType.ExecuteReader)
                {
                    returnValue = await sqlCommand.ExecuteReaderAsync();
                }
                else
                {
                    returnValue = "";
                }

            }
            return returnValue;
        }

        public static async Task<IList<T>> ExecuteProcedure<T>(string ProcedureName, Collection<DbParameters> parameters)
        {
            string connectionString = AppSettings.GetConnectionString();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                sqlConnection.Open();

                SqlCommand sqlCommand = new SqlCommand(ProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                if (parameters != null)
                {
                    AddParameters(ref sqlCommand, parameters);
                }
                //var result = ;
                return await DataReaderToList<T>(sqlCommand.ExecuteReader());
            }
        }

        public static async Task<T> ExecuteOneRecordProcedure<T>(string ProcedureName, Collection<DbParameters> parameters)
        {
            string connectionString = AppSettings.GetConnectionString();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                sqlConnection.Open();

                SqlCommand sqlCommand = new SqlCommand(ProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                if (parameters != null)
                {
                    AddParameters(ref sqlCommand, parameters);
                }
                //var result = ;
                return await GetValueFromReader<T>(sqlCommand.ExecuteReader());
            }
        }

        public static async Task<T> ExecuteOneRecordProcedureWithQuery<T>(string Query, Collection<DbParameters> parameters)
        {
            string connectionString = AppSettings.GetConnectionString();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                sqlConnection.Open();

                SqlCommand sqlCommand = new SqlCommand(Query, sqlConnection);
                sqlCommand.CommandType = CommandType.Text;

                if (parameters != null)
                {
                    AddParameters(ref sqlCommand, parameters);
                }
                //var result = ;
                return await GetValueFromReader<T>(sqlCommand.ExecuteReader());
            }
        }

        public static void AddParameters(ref SqlCommand sqlCommand, Collection<DbParameters> parameters)
        {
            foreach (DbParameters param in parameters)
            {
                if (param.Direction == ParameterDirection.Output)
                {
                    SqlParameter sqlParameter = new()
                    {
                        DbType = param.DBType,
                        Direction = ParameterDirection.Output,
                        ParameterName = param.Name,
                    };
                    if (param.TypeName != null)
                    {
                        sqlParameter.TypeName = param.TypeName;
                        sqlParameter.SqlDbType = SqlDbType.Structured;
                    }
                    sqlCommand.Parameters.Add(sqlParameter);
                }
                else
                {
                    SqlParameter sqlParameter = new()
                    {
                        DbType = param.DBType,
                        Direction = ParameterDirection.Input,
                        ParameterName = param.Name,
                        Value = param.Value
                    };
                    if (param.TypeName != null)
                    {
                        sqlParameter.TypeName = param.TypeName;
                        sqlParameter.SqlDbType = SqlDbType.Structured;
                    }
                    sqlCommand.Parameters.Add(sqlParameter);
                }

            }
        }

        public static async Task<List<T>> DataReaderToList<T>(IDataReader dataReader)
        {
            List<T> list = new();

            T obj = default(T);

            while (dataReader.Read())
            {
                obj = Activator.CreateInstance<T>();
                for (int i = 0; i < dataReader.FieldCount; i++)
                {
                    PropertyInfo propertyInfo =obj.GetType().GetProperties().FirstOrDefault(o => o.Name.ToLower() == dataReader.GetName(i).ToLower());
                    if (propertyInfo != null)
                    {
                        if (dataReader.GetFieldType(i) == typeof(Int64))
                        {
                            propertyInfo.SetValue(obj, dataReader.GetValue(i) != DBNull.Value ? Convert.ToInt32(dataReader.GetValue(i)) : null, null);
                        }
                        else
                        {
                            propertyInfo.SetValue(obj, dataReader.GetValue(i) != DBNull.Value ? dataReader.GetValue(i) : null, null);
                        }
                    }
                }
                 list.Add(obj);
            }
            return list;
        }

        private static async Task<T> GetValueFromReader<T>(SqlDataReader dataReader)
        {

            T obj = Activator.CreateInstance<T>();
            if (!dataReader.Read()) // Check if there are any records to read
                return obj;

            for (int i = 0; i < dataReader.FieldCount; i++)
            {
                PropertyInfo propertyInfo = obj.GetType().GetProperties().FirstOrDefault(o => o.Name.ToLower() == dataReader.GetName(i).ToLower());
                if (propertyInfo != null)
                {
                    if (dataReader.GetFieldType(i) == typeof(Int64))
                    {
                        propertyInfo.SetValue(obj, dataReader.GetValue(i) != DBNull.Value ? Convert.ToInt32(dataReader.GetValue(i)) : null, null);
                    }
                    else
                    {
                        propertyInfo.SetValue(obj, dataReader.GetValue(i) != DBNull.Value ? dataReader.GetValue(i) : null, null);
                    }
                }
            }

            return obj;
        }
    }
}
