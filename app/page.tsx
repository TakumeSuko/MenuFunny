'use client';

import { useRef, useState } from 'react';

type Item = {
  type: 'Fruit' | 'Vegetable';
  name: string;
};

const initialData: Item[] = [
  { type: 'Fruit', name: 'Apple' },
  { type: 'Vegetable', name: 'Broccoli' },
  { type: 'Vegetable', name: 'Mushroom' },
  { type: 'Fruit', name: 'Banana' },
  { type: 'Vegetable', name: 'Tomato' },
  { type: 'Fruit', name: 'Orange' },
  { type: 'Fruit', name: 'Mango' },
  { type: 'Fruit', name: 'Pineapple' },
  { type: 'Vegetable', name: 'Cucumber' },
  { type: 'Fruit', name: 'Watermelon' },
  { type: 'Vegetable', name: 'Carrot' },
];

export default function Page() {
  const [allItems, setALlItems] = useState<Item[]>(initialData);
  const [tableItems, setTableItems] = useState<Item[]>([]);
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const returnQueueRef = useRef(0);
  const AUTO_RETURN_DELAY = 5000;
  const STEP_DELAY = 1000;

  const addTable = (item: Item) => {
    setTableItems((prev) => [...prev, item]);
    setALlItems((prev) => prev.filter((i) => i.name !== item.name));

    const timeout = setTimeout(() => {
      const now = Date.now();
      const delay = Math.max(0, returnQueueRef.current - now);
      const scheduledTime = now + delay + STEP_DELAY;
      returnQueueRef.current = scheduledTime;

      setTimeout(() => {
        deleteTable(item);
      }, delay + STEP_DELAY);
    }, AUTO_RETURN_DELAY);

    timeouts.current[item.name] = timeout;
  };

  const deleteTable = (item: Item) => {
    setALlItems((prev) => [...prev, item]);
    setTableItems((prev) => prev.filter((i) => i.name !== item.name));
    if (timeouts.current[item.name]) {
      clearTimeout(timeouts.current[item.name]);
      delete timeouts.current[item.name];
    }
  };

  const fruits = tableItems.filter((item) => item.type === 'Fruit');
  const vegetables = tableItems.filter((item) => item.type === 'Vegetable');

  return (
    <div className='min-h-screen bg-gray-100 p-10'>
      <div className='grid grid-cols-3 gap-6'>
        <div className='bg-white p-4 rounded-xl shadow'>
          <div className='space-y-2'>
            {allItems.map((item, index) => (
              <div
                key={index}
                onClick={() => addTable(item)}
                className='border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 cursor-pointer text-black text-center'
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className='col-span-2 bg-white p-4 rounded-xl shadow'>
          <div className='grid grid-cols-2 gap-6'>
            <div className=' h-200 border-1 border-gray-200'>
              <h3 className='font-medium mb-2 text-center bg-gray-200 py-2 text-black '>
                Fruit
              </h3>
              <div className='px-4'>
                <table className='w-full border-separate border-spacing-y-3'>
                  <tbody>
                    {fruits.map((item, index) => (
                      <tr
                        className='cursor-pointer'
                        key={index}
                        onClick={() => deleteTable(item)}
                      >
                        <td className='px-4 py-3 bg-white border-1 border-gray-200 rounded text-black text-center hover:bg-gray-50 transition'>
                          {item.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className=' h-200 border-1 border-gray-200'>
              <h3 className='font-medium mb-2 text-center bg-gray-200 py-2 text-black '>
                Vegetable
              </h3>
              <div className='px-4'>
                <table className='w-full border-separate border-spacing-y-3'>
                  <tbody>
                    {vegetables.map((item, index) => (
                      <tr
                        className='cursor-pointer'
                        key={index}
                        onClick={() => deleteTable(item)}
                      >
                        <td className='px-4 py-3 bg-white border-1 border-gray-200 rounded text-black text-center hover:bg-gray-50 transition'>
                          {item.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
