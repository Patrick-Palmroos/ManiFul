import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { ImageScanType } from '../../../../types/raspberry';
import { useTypes } from '../../../../context/TypesContext';
import text from '../../../../styles/text';
import { useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { transactionPost } from '../../../../types/data';
import { useTransactions } from '../../../../context/TransactionContext';
import { useModalContext } from '../../../../context/ModalContext';
import colors from '../../../../styles/colors';
import generalStyles from '../../../../styles/styles';

type displayDataGroup = {
  category_id: number;
  category_name: string;
  items: {
    name: string;
    price: number;
    discount: number | null;
    type_id: number;
    type_name: string;
  }[];
};

const stringToDate = (dateString: string) => {
  const [day, month, year] = dateString.split('.');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const dateToText = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const ReceiptContents = ({
  data,
  close,
}: {
  data: ImageScanType;
  close: () => void;
}) => {
  const { categories, types } = useTypes();
  const [date, setDate] = useState<Date>(
    data.date ? stringToDate(data.date) : new Date(),
  );
  const [vendor, setVendor] = useState<string>(
    data.vendor ? data.vendor : 'No vendor',
  );
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const [editableItems, setEditableItems] = useState<displayDataGroup[]>([]);
  const [selection, setSelection] = useState<
    | {
        start: number;
        end?: number;
      }
    | undefined
  >({ start: 0 });
  const [tempInputValues, setTempInputValues] = useState<{
    [key: string]: string;
  }>({});
  const { createTransaction } = useTransactions();
  const { closeAllModals } = useModalContext();

  const handleFocus = () => {
    setSelection(undefined);
  };
  const handleBlur = () => {
    setSelection({ start: 0 });
  };

  console.log('Receipt data: ', data);
  console.log('cats: ', categories);
  console.log('types: ', types);

  if (!categories || !types || !editableItems) {
    return <View>Loading...</View>;
  }

  useEffect(() => {
    if (categories && types && data) {
      const initialGroupItems = categories
        .map(category => {
          // Get all type IDs for this category
          const categoryTypeIds = category.types.map(type => type.id);

          // Filter items that belong to any of these types
          const itemsForCategory = data.items
            .filter(
              item => item.type_id && categoryTypeIds.includes(item.type_id),
            )
            .map(item => {
              // Find the specific type to get its name
              const itemType = category.types.find(
                type => type.id === item.type_id,
              );
              return {
                ...item,
                type_name: itemType?.name || 'Unknown',
              };
            });

          // Only include categories with items
          return itemsForCategory.length > 0
            ? {
                category_id: category.id,
                category_name: category.name,
                items: itemsForCategory,
              }
            : null;
        })
        .filter((group): group is displayDataGroup => group !== null);
      setEditableItems(initialGroupItems);
    }
  }, []);

  const updateItemField = (
    groupIndex: number,
    itemIndex: number,
    field: keyof displayDataGroup['items'][0],
    value: string | number | null,
  ) => {
    setEditableItems(prev => {
      const updated = [...prev];
      const itemToUpdate = { ...updated[groupIndex].items[itemIndex] };

      if (field === 'price' || field === 'discount' || field === 'type_id') {
        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
          itemToUpdate[field] = numberValue as any;
        } else {
          return prev;
        }
      } else if (field === 'name' || field === 'type_name') {
        itemToUpdate[field] = (value ?? '') as any;
      }

      updated[groupIndex].items[itemIndex] = itemToUpdate;
      return updated;
    });
  };

  const handleOnConfirm = async () => {
    try {
      /* const test = {
        total: 100.5,
        vendor: 'Test Vendor',
        date: '2025-07-05T15:30:00Z',
        items: [
          {
            typeId: 2,
            name: 'Item One',
            total: 100.5,
          },
        ],
      };*/

      const res: transactionPost = {
        total: getTotal(),
        vendor: vendor,
        date: date.toISOString(),
        items: editableItems.flatMap(cat =>
          cat.items.map(item => ({
            type_id: item.type_id,
            name: item.name,
            total: item.price,
          })),
        ),
      };

      const result = await createTransaction(res);
      console.log(result);
      if (result) {
        closeAllModals();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const getTotal = () => {
    const total = editableItems
      .flatMap(cat => cat.items.map(item => item.price))
      .reduce((sum, price) => sum + price, 0);

    return parseFloat(total.toFixed(2)); // Ensures it's a number, not a string
  };

  return (
    <View
      style={{
        //backgroundColor: 'red',
        height: 500,
      }}>
      <TextInput
        style={{
          ...text.title,
          fontSize: 19,
          textDecorationLine: 'underline',
          textAlign: 'left',
          paddingVertical: 4,
          textAlignVertical: 'center',
        }}
        value={vendor}
        onBlur={handleBlur}
        onFocus={handleFocus}
        selection={selection}
        onChangeText={text => setVendor(text)}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 20,
        }}>
        <View style={{ flexDirection: 'row', gap: 10, padding: 5 }}>
          <Text style={{ ...text.regular, fontFamily: 'Rubik-Medium' }}>
            {dateToText(date)}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              padding: 3,
              borderRadius: 8,
              width: 25,
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setDateOpen(true)}>
            <MaterialIcons name="edit" size={15} color={'white'} />
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          mode="date"
          locale="en" // change to fi for finnish
          date={date}
          open={dateOpen}
          onCancel={() => setDateOpen(false)}
          onConfirm={date => {
            setDateOpen(false);
            setDate(date);
          }}
        />
        <Text style={{ ...text.moneyDark, color: colors.textDefault }}>
          Total: <Text style={text.moneyDark}>{getTotal()}€</Text>
        </Text>
      </View>
      <ScrollView
        style={{
          //backgroundColor: 'yellow',
          marginVertical: 8,
        }}
        persistentScrollbar
        contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableWithoutFeedback>
          <View
            style={
              {
                //flex: 1,
                // backgroundColor: 'green',
                //padding: 2,
                //borderRadius: 5,
              }
            }>
            {editableItems.map((group, groupIndex) => (
              <View
                key={groupIndex}
                style={{
                  backgroundColor: '#dcdfebff',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text style={{ ...text.title, fontSize: 24 }}>
                  {group.category_name}
                </Text>
                {/* Items */}
                {group.items.map((item, itemIndex) => (
                  <View
                    key={itemIndex}
                    style={{
                      flexDirection: 'row',
                      //backgroundColor: 'yellow',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingRight: 10,
                    }}>
                    {/* Name */}
                    <TextInput
                      style={{
                        ...generalStyles.textField,
                        backgroundColor: '#dcdfebff',
                        paddingLeft: 5,
                        height: '80%',
                        paddingBottom: 0,
                        paddingTop: 0,
                        width: '45%',
                      }}
                      value={item.name}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      selection={selection}
                      onChangeText={text =>
                        updateItemField(groupIndex, itemIndex, 'name', text)
                      }
                    />{' '}
                    {/* Type */}
                    <View
                      style={{
                        ...text.regular,
                        alignItems: 'center',
                        width: '28%',
                      }}>
                      <Text
                        style={{
                          ...text.moneyDark,
                          color: colors.textDefault,
                          fontSize: 14,
                          backgroundColor: colors.backgroundWarm,
                          textAlign: 'center',
                          width: 'auto',
                          borderRadius: 8,
                          padding: 3,
                        }}>
                        {item.type_name}
                      </Text>
                    </View>
                    {/* Price */}
                    <View
                      style={{ alignItems: 'center', flexDirection: 'row' }}>
                      <TextInput
                        style={{
                          ...text.moneyDark,
                          textDecorationLine: 'underline',
                          paddingLeft: 5,
                        }}
                        value={
                          tempInputValues[`${groupIndex}-${itemIndex}-price`] ??
                          item.price.toString()
                        }
                        keyboardType="numeric"
                        onBlur={() => {
                          handleBlur();

                          const temp =
                            tempInputValues[`${groupIndex}-${itemIndex}-price`];
                          const parsed = Number(temp?.replace(',', '.'));

                          if (!isNaN(parsed)) {
                            updateItemField(
                              groupIndex,
                              itemIndex,
                              'price',
                              parsed,
                            );
                          }

                          // Clean up temporary input
                          setTempInputValues(prev => {
                            const updated = { ...prev };
                            delete updated[`${groupIndex}-${itemIndex}-price`];
                            return updated;
                          });
                        }}
                        onFocus={handleFocus}
                        selection={selection}
                        onChangeText={text => {
                          setTempInputValues(prev => ({
                            ...prev,
                            [`${groupIndex}-${itemIndex}-price`]: text,
                          }));
                        }}
                      />
                      <Text style={text.moneyDark}>€</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Button title="cancel" onPress={close} />
      <Button title="save" onPress={handleOnConfirm} />
    </View>
  );
};

export default ReceiptContents;
