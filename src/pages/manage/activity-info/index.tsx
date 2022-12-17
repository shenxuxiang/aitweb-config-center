import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useDeferredValue,
  useTransition,
  useEffect,
  useRef,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Map, APILoader, ToolBarControl, Geolocation, Marker } from '@uiw/react-amap';
import actions from '@/redux/actions/manage-activity-info';
import styles from './index.module.less';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Table from '@/components/Table';
import useReducer from '@/utils/useReducer';
import { createKey } from '@/utils';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Popconfirm from '@/components/Popconfirm';
import Upload from '@/components/Upload';
import { send } from '@/utils/request';

const REGEO_URL = 'https://restapi.amap.com/v3/geocode/regeo?&key=a0fc2e9ca47ddddb0f53e9126aaea95c';

const mapStateFromProps = (state: any) => state.manageActivityInfo;
const mapDispatchFromProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

const iconList = [
  'html5',
  'webpack',
  'reactjs',
  'nodejs',
  'ziyuan',
  'shell',
  'nginx',
  'css3',
  'javascript',
  'ant-design',
  'anli',
  'wufuqi',
  'yunwei',
  'yindao',
  'webkaifa',
];

const initialState = {
  courses: [] as any[],
  copyCourses: [] as any[],
  characteristic: [] as any[],
  copyCharacteristic: [] as any[],
  advantages: [] as any[],
  copyAdvantages: [] as any,
  contactPhoneNumber: '',
  contactQrcode: [],
  shareInfoImageUrl: [],
  shareInfoPath: '',
  shareInfoTitle: '',
  teacherInfoAvatar: [],
  teacherInfoName: '',
  teacherInfoIntroduce: '',
  addressName: '',
  longitude: '',
  latitude: '',
  addressNameCopy: '',
};

function ActivityInfo(props: any) {
  const [state, setState] = useReducer(initialState);
  const {
    copyCourses,
    copyCharacteristic,
    copyAdvantages,
    contactPhoneNumber,
    contactQrcode,
    shareInfoImageUrl,
    shareInfoPath,
    shareInfoTitle,
    teacherInfoAvatar,
    teacherInfoName,
    teacherInfoIntroduce,
    addressName,
    longitude,
    latitude,
  } = state;

  useLayoutEffect(() => {
    props
      .queryActivityInfo()
      .then((res: any) => {
        const { data, code } = res;
        const copyCourses = data.courses?.map((item: any) => ({ ...item, _id: createKey(), edit: false })) ?? [];
        const copyCharacteristic =
          data.characteristic?.map((item: any) => ({ ...item, _id: createKey(), edit: false })) ?? [];
        const copyAdvantages = data.advantages?.map((item: any) => ({ ...item, _id: createKey(), edit: false })) ?? [];
        const contactPhoneNumber = data.contact?.phoneNumber;
        const contactQrcode = [{ url: data.contact.qrcode, status: 'done', uid: createKey() }];
        const shareInfoImageUrl = [{ url: data.shareInfo?.imageUrl, status: 'done', uid: createKey() }];
        const shareInfoPath = data.shareInfo?.path;
        const shareInfoTitle = data.shareInfo?.title;
        const teacherInfoAvatar = [{ url: data.teacherInfo?.avatar, status: 'done', uid: createKey() }];
        const teacherInfoName = data.teacherInfo?.name;
        const teacherInfoIntroduce = data.teacherInfo?.introduce;
        const addressName = data.address.name;
        const { longitude } = data.address;
        const { latitude } = data.address;

        if (code === 0) {
          setState({
            ...state,
            ...data,
            copyCourses,
            copyCharacteristic,
            copyAdvantages,
            contactPhoneNumber,
            contactQrcode,
            shareInfoImageUrl,
            shareInfoPath,
            shareInfoTitle,
            teacherInfoAvatar,
            teacherInfoName,
            teacherInfoIntroduce,
            addressName,
            longitude,
            latitude,
          });
        }
      })
      .catch((error: any) => console.log(error));
  }, []);

  const courseColumns = useMemo(
    () => [
      {
        dataIndex: 'context',
        title: '课程名称',
        render: (context: string, record: any, index: number) => {
          if (!record.edit) return context;

          const handleChange = (event: any) => {
            const { value } = event.target;
            setState((prevState) => {
              const nextValue = [...prevState.copyCourses];
              nextValue[index].context = value;
              return { copyCourses: nextValue };
            });
          };

          return (
            <Input
              value={context}
              onChange={handleChange}
              defaultValue={context}
              placeholder="请输入课程名称"
              style={{ width: 200 }}
            />
          );
        },
      },
      {
        dataIndex: 'icon',
        title: '图标类型',
        render: (icon: string, record: any, index: number) => {
          if (!record.edit) {
            return (
              <div style={{ lineHeight: '32px', height: '32px' }}>
                <Icon
                  name={icon}
                  style={{
                    fontSize: 30,
                    color: 'rgba(0, 0, 0, 0.45)',
                    lineHeight: 1,
                    verticalAlign: 'middle',
                    marginRight: 10,
                  }}
                />
                {icon}
              </div>
            );
          }

          const handleChange = (value: string) => {
            setState((prevState) => {
              const nextValue = [...prevState.copyCourses];
              nextValue[index].icon = value;
              return { copyCourses: nextValue };
            });
          };
          return (
            <Select value={icon} onChange={handleChange} placeholder="请输入icon名称" style={{ width: 150 }}>
              {iconList.map((item) => (
                <Select.Option value={item} key={item} title={item}>
                  <Icon
                    name={item}
                    style={{
                      fontSize: 16,
                      color: 'rgba(0, 0, 0, 0.45)',
                      lineHeight: 1,
                      verticalAlign: 'middle',
                      marginRight: 10,
                    }}
                  />
                  {item}
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
      {
        dataIndex: 'options',
        title: '课程ID',
        render: (text: string, record: any, index: number) => {
          if (!record.edit) return text;

          const handleChange = (event: any) => {
            const { value } = event.target;
            setState((prevState) => {
              const nextValue = [...prevState.copyCourses];
              nextValue[index].options = value;
              return { copyCourses: nextValue };
            });
          };

          return <Input value={text} onChange={handleChange} placeholder="请输入课程ID" style={{ width: 200 }} />;
        },
      },
      {
        dataIndex: '_id',
        title: '操作',
        width: 150,
        render: (id: string, record: any, index: number) => {
          const handleEdit = () => {
            setState((prevState) => {
              const nextValue = [...prevState.copyCourses];
              nextValue[index].edit = true;
              return { copyCourses: nextValue };
            });
          };

          const handleSave = () => {
            setState((prevState) => {
              const nextCourses = [...prevState.courses];
              const nextCopyCourses = [...prevState.copyCourses];
              nextCopyCourses[index].edit = false;
              const item = { ...prevState.copyCourses[index] };
              delete item.edit;
              delete item._id;
              nextCourses[index] = item;
              return { courses: nextCourses, copyCourses: nextCopyCourses };
            });
          };

          const handleCancel = () => {
            setState((prevState) => {
              const nextCopyCourses = [...prevState.copyCourses];
              nextCopyCourses[index] = { ...nextCopyCourses[index], ...prevState.courses[index], edit: false };
              return { copyCourses: nextCopyCourses };
            });
          };

          return (
            <div>
              {record.edit ? (
                <>
                  <Button type="link" onClick={handleSave}>
                    保存
                  </Button>
                  <Popconfirm title="确定要取消操作吗？" onConfirm={handleCancel} placement="topRight">
                    <Button type="link">取消</Button>
                  </Popconfirm>
                </>
              ) : (
                <Button type="link" onClick={handleEdit}>
                  编辑
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const characteristicColumns = useMemo(
    () => [
      {
        title: '标题',
        dataIndex: 'subtitle',
        width: 300,
        render: (title: string, record: any, index: number) => {
          if (!record.edit) return title;

          const handleChange = (event: any) => {
            const { value } = event.target;
            setState((prevState) => {
              const nextCopyCharacteristic = [...prevState.copyCharacteristic];
              nextCopyCharacteristic[index].subtitle = value;
              return { copyCharacteristic: nextCopyCharacteristic };
            });
          };

          return <Input value={title} onChange={handleChange} placeholder="请输入标题" maxLength={16} />;
        },
      },
      {
        title: '内容介绍',
        dataIndex: 'context',
        render: (context: string, record: any, index: number) => {
          if (!record.edit) return context;

          const handleChange = (event: any) => {
            const { value } = event.target;
            setState((prevState) => {
              const nextCopyCharacteristic = [...prevState.copyCharacteristic];
              nextCopyCharacteristic[index].context = value;
              return { copyCharacteristic: nextCopyCharacteristic };
            });
          };

          return <Input value={context} onChange={handleChange} placeholder="请输入内容" maxLength={80} />;
        },
      },
      {
        dataIndex: '_id',
        title: '操作',
        width: 150,
        render: (id: string, record: any, index: number) => {
          const handleEdit = () => {
            setState((prevState) => {
              const nextCopyCharacteristic = [...prevState.copyCharacteristic];
              nextCopyCharacteristic[index].edit = true;
              return { copyCharacteristic: nextCopyCharacteristic };
            });
          };

          const handleSave = () => {
            setState((prevState) => {
              const nextCharacteristic = [...prevState.characteristic];
              const nextCopyCharacteristic = [...prevState.copyCharacteristic];
              nextCopyCharacteristic[index].edit = false;
              const item = { ...prevState.copyCourses[index] };
              delete item.edit;
              delete item._id;
              nextCharacteristic[index] = item;
              return { characteristic: nextCharacteristic, copyCharacteristic: nextCopyCharacteristic };
            });
          };

          const handleCancel = () => {
            setState((prevState) => {
              const nextCopyCharacteristic = [...prevState.copyCharacteristic];
              nextCopyCharacteristic[index] = {
                ...nextCopyCharacteristic[index],
                ...prevState.copyCharacteristic[index],
                edit: false,
              };
              return { copyCharacteristic: nextCopyCharacteristic };
            });
          };

          return (
            <div>
              {record.edit ? (
                <>
                  <Button type="link" onClick={handleSave}>
                    保存
                  </Button>
                  <Popconfirm title="确定要取消操作吗？" onConfirm={handleCancel} placement="topRight">
                    <Button type="link">取消</Button>
                  </Popconfirm>
                </>
              ) : (
                <Button type="link" onClick={handleEdit}>
                  编辑
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const advantagesColumns = useMemo(
    () => [
      {
        title: '展示图标',
        dataIndex: 'icon',
        width: 300,
        render: (icon: string, record: any, index: number) => {
          if (!record.edit) {
            return (
              <div style={{ lineHeight: '32px', height: '32px' }}>
                <Icon
                  name={icon}
                  style={{
                    fontSize: 30,
                    color: 'rgba(0, 0, 0, 0.45)',
                    lineHeight: 1,
                    verticalAlign: 'middle',
                    marginRight: 10,
                  }}
                />
                {icon}
              </div>
            );
          }

          const handleChange = (value: string) => {
            setState((prevState) => {
              const nextCopyAdvantages = [...prevState.copyAdvantages];
              nextCopyAdvantages[index].icon = value;
              return { copyAdvantages: nextCopyAdvantages };
            });
          };

          return (
            <Select value={icon} onChange={handleChange} placeholder="请选择图标" style={{ width: 150 }}>
              {iconList.map((item) => (
                <Select.Option value={item} key={item} title={item}>
                  <Icon
                    name={item}
                    style={{
                      fontSize: 16,
                      color: 'rgba(0, 0, 0, 0.45)',
                      lineHeight: 1,
                      verticalAlign: 'middle',
                      marginRight: 10,
                    }}
                  />
                  {item}
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: '内容介绍',
        dataIndex: 'context',
        render: (context: string, record: any, index: number) => {
          if (!record.edit) return context;

          const handleChange = (event: any) => {
            setState((prevState) => {
              const { value } = event.target;
              const nextCopyAdvantages = [...prevState.copyAdvantages];
              nextCopyAdvantages[index].context = value;
              return { copyAdvantages: nextCopyAdvantages };
            });
          };

          return <Input value={context} onChange={handleChange} placeholder="请输入内容介绍" />;
        },
      },
      {
        title: '操作',
        dataIndex: '_id',
        width: 150,
        render: (id: string, record: any, index: number) => {
          const handleEdit = () => {
            setState((prevState) => {
              const nextCopyAdvantages = [...prevState.copyAdvantages];
              nextCopyAdvantages[index].edit = true;
              return { copyAdvantages: nextCopyAdvantages };
            });
          };

          const handleSave = () => {
            setState((prevState) => {
              const nextAdvantages = [...prevState.advantages];
              const nextCopyAdvantages = [...prevState.copyAdvantages];
              nextCopyAdvantages[index].edit = false;
              const item = { ...prevState.copyAdvantages[index] };
              delete item.edit;
              delete item._id;
              nextAdvantages[index] = item;
              return { advantages: nextAdvantages, copyAdvantages: nextCopyAdvantages };
            });
          };

          const handleCancel = () => {
            setState((prevState) => {
              const nextCopyAdvantages = [...prevState.copyAdvantages];

              nextCopyAdvantages[index] = { ...nextCopyAdvantages[index], ...prevState.advantages[index], edit: false };
              return { copyAdvantages: nextCopyAdvantages };
            });
          };

          return (
            <div>
              {record.edit ? (
                <>
                  <Button type="link" onClick={handleSave}>
                    保存
                  </Button>
                  <Popconfirm title="确定要取消操作吗？" onConfirm={handleCancel} placement="topRight">
                    <Button type="link">取消</Button>
                  </Popconfirm>
                </>
              ) : (
                <Button type="link" onClick={handleEdit}>
                  编辑
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const handleChangeContactQrcode = useCallback((fileList: any) => {
    setState({ contactQrcode: fileList });
  }, []);

  const handleChangeContactPhoneNumber = useCallback((event: any) => {
    setState({ contactPhoneNumber: event.target.value });
  }, []);

  const handleChangeShareInfoTitle = useCallback((event: any) => {
    setState({ shareInfoTitle: event.target.value });
  }, []);

  const handleChangeShareInfoPath = useCallback((event: any) => {
    setState({ shareInfoPath: event.target.value });
  }, []);

  const handleChangeShareInfoImageUrl = useCallback((fileList: any) => {
    setState({ shareInfoImageUrl: fileList });
  }, []);

  const handleChangeTeacherInfoName = useCallback((event: any) => {
    setState({ teacherInfoName: event.target.value });
  }, []);

  const handleChangeTeacherInfoIntroduce = useCallback((event: any) => {
    setState({ teacherInfoIntroduce: event.target.value });
  }, []);

  const handleChangeTeacherInfoAvatar = useCallback((fileList: any) => {
    setState({ teacherInfoAvatar: fileList });
  }, []);

  const handleChangeAddress = useCallback((event: any) => {
    const { lng, lat } = event.lnglat;
    send(`${REGEO_URL}&location=${lng},${lat}`, 'GET', null).then((response: any) => {
      const { status, regeocode } = response;
      if (status === '1') {
        setState({ addressName: regeocode.formatted_address, longitude: String(lng), latitude: String(lat) });
      }
    });
  }, []);

  const handleChangeAddressName = useCallback((event: any) => {
    setState({ addressName: event.target.value });
  }, []);
  console.log(state.count, 'count');

  return (
    <div className={styles.page}>
      <h1
        className={styles.module_title}
        onClick={() => {
          setTimeout(() => {
            alert(addressName);
          }, 3000);
        }}
      >
        地址
      </h1>
      <div className={styles.module_content}>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>地址名称： </span>
          <Input
            placeholder="请输入详细地址"
            type="text"
            value={addressName}
            onChange={handleChangeAddressName}
            width={500}
          />
        </div>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>经纬度： </span>
          <Input type="text" value={`${longitude},${latitude}`} width={300} disabled />
        </div>
        <div style={{ height: '400px', marginTop: 20 }}>
          <APILoader akay="314007a9518846eb7e3df09babf811a0">
            <Map style={{ height: 400 }} center={[longitude, latitude]} onClick={handleChangeAddress}>
              {({ AMap }: any) => {
                return (
                  <>
                    <ToolBarControl offset={[16, 10]} position="RB" />
                    <Geolocation
                      maximumAge={100000}
                      borderRadius="5px"
                      position="RB"
                      offset={[16, 80]}
                      zoomToAccuracy
                      showCircle
                    />
                    <Marker
                      visiable
                      animation="AMAP_ANIMATION_DROP"
                      label={{ content: addressName, offset: new AMap.Pixel(0, -10), direction: 'top' }}
                      position={new AMap.LngLat(Number(longitude), Number(latitude))}
                    />
                  </>
                );
              }}
            </Map>
          </APILoader>
        </div>
      </div>

      <h1 className={styles.module_title} style={{ marginTop: 30 }}>
        课程大纲
      </h1>
      <Table columns={courseColumns} dataSource={copyCourses} rowKey="_id" bordered />
      <h1 className={styles.module_title} style={{ marginTop: 30 }}>
        培训生态链
      </h1>
      <Table columns={characteristicColumns} dataSource={copyCharacteristic} rowKey="_id" bordered />
      <h1 className={styles.module_title} style={{ marginTop: 30 }}>
        教学特色
      </h1>
      <Table columns={advantagesColumns} dataSource={copyAdvantages} rowKey="_id" bordered />
      <h1 className={styles.module_title} style={{ marginTop: 30 }}>
        联系方式
      </h1>
      <div className={styles.module_content}>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>电话号码： </span>
          <Input
            placeholder="请输入电话号码"
            type="text"
            value={contactPhoneNumber}
            onChange={handleChangeContactPhoneNumber}
            width={300}
            rules={[{ message: '格式错误', pattern: /^1(9|8|7|5|3)\d{9}$/ }]}
          />
        </div>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>微信二维码： </span>
          <Upload action="/api/upload/mini-program/images" value={contactQrcode} onChange={handleChangeContactQrcode} />
        </div>
      </div>

      <h1 className={styles.module_title} style={{ marginTop: 30 }}>
        小程序分享配置
      </h1>
      <div className={styles.module_content}>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>分享标题： </span>
          <Input
            placeholder="请输入标题"
            type="text"
            value={shareInfoTitle}
            onChange={handleChangeShareInfoTitle}
            width={300}
          />
        </div>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>分享路径： </span>
          <Input
            placeholder="请输入路径"
            type="text"
            value={shareInfoPath}
            onChange={handleChangeShareInfoPath}
            width={300}
          />
        </div>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>分享图片： </span>
          <Upload
            action="/api/upload/mini-program/images"
            value={shareInfoImageUrl}
            onChange={handleChangeShareInfoImageUrl}
          />
        </div>
      </div>

      <h1 className={styles.module_title} style={{ marginTop: 30 }}>
        师资信息
      </h1>
      <div className={styles.module_content}>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>教师姓名： </span>
          <Input
            placeholder="请输入姓名"
            type="text"
            value={teacherInfoName}
            onChange={handleChangeTeacherInfoName}
            width={300}
          />
        </div>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>人物介绍： </span>
          <Input
            placeholder="请输入人物介绍"
            type="text"
            value={teacherInfoIntroduce}
            onChange={handleChangeTeacherInfoIntroduce}
            width={700}
            maxLength={50}
            prefix="人物介绍"
            suffix={<span style={{ color: '#ccc' }}>{`${teacherInfoIntroduce.length}/50`}</span>}
          />
        </div>
        <div className={styles.module_content_item}>
          <span className={styles.module_content_item_title}>人物头像： </span>
          <Upload
            action="/api/upload/mini-program/images"
            value={teacherInfoAvatar}
            onChange={handleChangeTeacherInfoAvatar}
          />
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateFromProps, mapDispatchFromProps)(memo(ActivityInfo));
