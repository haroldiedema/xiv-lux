  /* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.Common                              |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

using System.Collections.Generic;
using System.Linq;

namespace Lux.Common.Model;

[Service]
public sealed class ModelSerializer
{
    private static ModelSerializer _instance = null!;
    private readonly ModelRepository _repository;

    public ModelSerializer(ModelRepository repository)
    {
        _repository = repository;
        _instance = this;
    }

    public static ModelSerializer Instance => _instance;

    public object? Serialize(object? model)
    {
        if (null == model) {
            return null;
        }

        var type = model.GetType();
        
        if (type.IsArray) {
            var array = (object[]) model;
            var serializedArray = new List<object?>();
            foreach (var item in array) {
                if (null != item && _repository.IsModel(item)) {
                    serializedArray.Add(Serialize(item));
                } else {
                    serializedArray.Add(item);
                }
            }
            return serializedArray;
        }

        if (type.IsGenericType) {
            var list = (System.Collections.IList) model;
            var serializedList = new List<object?>();
            foreach (var item in list) {
                if (null != item && _repository.IsModel(item)) {
                    serializedList.Add(Serialize(item));
                } else {
                    serializedList.Add(item);
                }
            }
            return serializedList;
        }

        if (false == _repository.IsModel(model)) {
            return model;
        }

        var offsets = _repository.GetOffsets(model);
        var maxOffset = offsets.Values.Max() + 1;
        
        object?[] values = new object?[maxOffset];

        foreach (var field in offsets) {

            var property = type.GetField(field.Key);
            if (property != null) {
                var value = property.GetValue(model)!;

                if (null != model && _repository.IsModel(value)) {
                    value = Serialize(value);
                }

                if (value is System.Collections.IList list) {
                    var serializedList = new List<object?>();
                    foreach (var item in list) {
                        if (null != item && _repository.IsModel(item)) {
                            serializedList.Add(Serialize(item));
                        } else {
                            serializedList.Add(item);
                        }
                    }
                    value = serializedList;
                }

                values[field.Value] = value;
            }
        }

        return new {
            _k = type.Name,
            _d = values,
        };
    }
}