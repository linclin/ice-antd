import { authPermission } from '@/services/casbin';
import store from '@/store';

export async function Auth({ children, obj, obj1, obj2, act, fallback }) {
   const [userState] = store.useModel('user');
   const authData = { obj, obj1, obj2, act };
  // 判断是否有权限
  const userPerm = await authPermission(userState.currentUser.name, authData);
  let hasAuth = false;
  if (userPerm.data.success && userPerm.data.data.auth) {
    hasAuth = true;
  }
  // 有权限时直接渲染内容
  if (hasAuth) {
    return children;
  } else {
    // 无权限时显示指定 UI
    return fallback;
  }
}
// 使用示例
// function Foo() {
//   return (
//     <Auth authKey={'obj','obj1','obj2','act'}>
//       <Button type="button">Star</Button>
//     </Auth>
//   );
// }