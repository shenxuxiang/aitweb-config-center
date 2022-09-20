import React, { useLayoutEffect, useState } from 'react';
import { combineReducers, AnyAction } from 'redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import store from '@/redux';
import { main } from '@/redux/reducers';

type IComponentType = React.FunctionComponent | React.ComponentClass;
type IReducer = (state: any, action: AnyAction) => any;
interface IModels {
  [propName: string]: IReducer;
}
type IDynamicLoad = () => Promise<any>;

export default function DynamicImport(dynamicLoad: IDynamicLoad, models?: IModels) {
  return function (props: any) {
    const [state, setState] = useState<IComponentType | null>(null);
    const params = useParams();
    const navigator = useNavigate();
    const location = useLocation();
    useLayoutEffect(() => {
      dynamicLoad().then((response) => {
        setState(() => response.default);
        let reducer: IReducer;
        // eslint-disable-next-line
        if (models == null) {
          reducer = combineReducers({ main });
        } else {
          reducer = combineReducers({ main, ...models });
        }
        store.replaceReducer(reducer);
      });
    }, []);

    if (!state) return <div>loading...</div>;
    const Comp = state;
    return <Comp {...props} params={params} navigator={navigator} location={location} />;
  };
}
